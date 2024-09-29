from __future__ import annotations
import asyncio
import aiohttp
import os
import re
import logging
import time
import traceback
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Callable, Optional, Awaitable
from enum import Enum
from dataclasses import dataclass, field
from urllib.parse import urlparse, urljoin

# Enum for download status types
class DownloadStatusType(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ERROR = "error"
    PAUSED = "paused"
    RESUMED = "resumed"

# Dataclass for download status
@dataclass
class DownloadStatus:
    status: str
    progress_percentage: float
    message: str
    already_existed: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "status": self.status,
            "progress_percentage": self.progress_percentage,
            "message": self.message,
            "already_existed": self.already_existed
        }

# Dataclass for individual model files
@dataclass
class ModelFile:
    name: str
    url: str
    size: int = 0
    requires_authentication: bool = False
    last_checked: float = field(default_factory=time.time)
    download_count: int = 0
    failure_count: int = 0
    failure_reason: Optional[str] = None

# Dataclass for repositories
@dataclass
class ModelRepository:
    name: str
    url: str
    files: List[ModelFile] = field(default_factory=list)
    readme: Optional[str] = None
    last_checked: float = field(default_factory=time.time)

# Class for handling local database interactions
class LocalDatabase:
    def __init__(self, db_path: str = "models_metadata.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(self.db_path)
        self._setup_tables()

    def _setup_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS repositories (
            id INTEGER PRIMARY KEY,
            name TEXT,
            url TEXT UNIQUE,
            readme TEXT,
            last_checked REAL
        )
        ''')
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS model_files (
            id INTEGER PRIMARY KEY,
            repo_id INTEGER,
            name TEXT,
            url TEXT UNIQUE,
            size INTEGER,
            requires_authentication INTEGER,
            last_checked REAL,
            download_count INTEGER,
            failure_count INTEGER,
            failure_reason TEXT,
            FOREIGN KEY(repo_id) REFERENCES repositories(id)
        )
        ''')
        self.conn.commit()

    def save_repository(self, repo: ModelRepository):
        cursor = self.conn.cursor()
        cursor.execute('''
        INSERT OR REPLACE INTO repositories (name, url, readme, last_checked)
        VALUES (?, ?, ?, ?)
        ''', (repo.name, repo.url, repo.readme, repo.last_checked))
        repo_id = cursor.lastrowid
        for file in repo.files:
            cursor.execute('''
            INSERT OR REPLACE INTO model_files (repo_id, name, url, size, requires_authentication, last_checked, download_count, failure_count, failure_reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (repo_id, file.name, file.url, file.size, int(file.requires_authentication), file.last_checked, file.download_count, file.failure_count, file.failure_reason))
        self.conn.commit()

    def get_repository(self, url: str) -> Optional[ModelRepository]:
        cursor = self.conn.cursor()
        cursor.execute('SELECT id, name, url, readme, last_checked FROM repositories WHERE url = ?', (url,))
        repo_row = cursor.fetchone()
        if repo_row:
            repo_id, name, url, readme, last_checked = repo_row
            cursor.execute('SELECT name, url, size, requires_authentication, last_checked, download_count, failure_count, failure_reason FROM model_files WHERE repo_id = ?', (repo_id,))
            files_rows = cursor.fetchall()
            files = [ModelFile(name=row[0], url=row[1], size=row[2], requires_authentication=bool(row[3]), last_checked=row[4], download_count=row[5], failure_count=row[6], failure_reason=row[7]) for row in files_rows]
            return ModelRepository(name=name, url=url, files=files, readme=readme, last_checked=last_checked)
        return None

    def update_model_file_stats(self, model_file: ModelFile):
        cursor = self.conn.cursor()
        cursor.execute('''
        UPDATE model_files
        SET download_count = ?, failure_count = ?, failure_reason = ?
        WHERE url = ?
        ''', (model_file.download_count, model_file.failure_count, model_file.failure_reason, model_file.url))
        self.conn.commit()

# Validation functions
def validate_model_subdirectory(model_subdirectory: str) -> bool:
    if len(model_subdirectory) > 50:
        return False
    if '..' in model_subdirectory or '/' in model_subdirectory:
        return False
    if not re.match(r'^[a-zA-Z0-9_-]+$', model_subdirectory):
        return False
    return True

def validate_filename(filename: str)-> bool:
    if not filename.lower().endswith(('.sft', '.safetensors', '.ckpt', '.pt', '.bin')):
        return False
    if not filename or not filename.strip():
        return False
    if any(char in filename for char in ['..', '/', '\\', '\n', '\r', '\t', '\0']):
        return False
    if filename.startswith('.'):
        return False
    if not re.match(r'^[a-zA-Z0-9_\-. ]+$', filename):
        return False
    if len(filename) > 255:
        return False
    return True

# Functions to fetch repository data and cache it
async def fetch_repository_data(repo_url: str, db: LocalDatabase) -> ModelRepository:
    repo = db.get_repository(repo_url)
    if repo and (time.time() - repo.last_checked) < 86400:  # 1 day cache
        return repo
    repo = await fetch_repo_from_url(repo_url)
    db.save_repository(repo)
    return repo

async def fetch_repo_from_url(repo_url: str) -> ModelRepository:
    repo_name = extract_repo_name(repo_url)
    model_files = await fetch_model_files_from_repo(repo_url)
    readme = await fetch_readme_from_repo(repo_url)
    return ModelRepository(name=repo_name, url=repo_url, files=model_files, readme=readme)

async def fetch_model_files_from_repo(repo_url: str) -> List[ModelFile]:
    # Placeholder implementation. Replace with actual logic to fetch files from the repository.
    # For example, use Hugging Face or CivitAI APIs to list files.
    # Here, we'll simulate fetching two model files.
    return [
        ModelFile(name="model1.safetensors", url=urljoin(repo_url, "model1.safetensors"), size=123456789),
        ModelFile(name="model2.safetensors", url=urljoin(repo_url, "model2.safetensors"), size=987654321)
    ]

async def fetch_readme_from_repo(repo_url: str) -> str:
    # Placeholder implementation. Replace with actual logic to fetch the readme.
    return "This is a sample readme content."

def extract_repo_name(repo_url: str) -> str:
    parsed_url = urlparse(repo_url)
    return os.path.basename(parsed_url.path)

# Download manager class
class DownloadManager:
    def __init__(self, models_base_dir: str, db: LocalDatabase):
        self.models_base_dir = models_base_dir
        self.db = db
        self.session = aiohttp.ClientSession()

    async def close(self):
        await self.session.close()

    async def download_models(self, model_files: List[ModelFile], model_sub_directory: str, progress_callback: Callable[[str, DownloadStatus], Awaitable[Any]], concurrent_downloads: int = 3):
        semaphore = asyncio.Semaphore(concurrent_downloads)
        tasks = []
        for model_file in model_files:
            tasks.append(self._download_model_with_semaphore(semaphore, model_file, model_sub_directory, progress_callback))
        await asyncio.gather(*tasks)

    async def _download_model_with_semaphore(self, semaphore: asyncio.Semaphore, model_file: ModelFile, model_sub_directory: str, progress_callback: Callable[[str, DownloadStatus], Awaitable[Any]]):
        async with semaphore:
            await self.download_model(model_file, model_sub_directory, progress_callback)

    async def download_model(self, model_file: ModelFile, model_sub_directory: str, progress_callback: Callable[[str, DownloadStatus], Awaitable[Any]]):
        if not validate_model_subdirectory(model_sub_directory):
            status = DownloadStatus(DownloadStatusType.ERROR.value, 0, "Invalid model subdirectory", False)
            await progress_callback(model_file.name, status)
            return

        if not validate_filename(model_file.name):
            status = DownloadStatus(DownloadStatusType.ERROR.value, 0, "Invalid model filename", False)
            await progress_callback(model_file.name, status)
            return

        file_path, relative_path = self.create_model_path(model_file.name, model_sub_directory, self.models_base_dir)

        if os.path.exists(file_path):
            status = DownloadStatus(DownloadStatusType.COMPLETED.value, 100, f"{model_file.name} already exists", True)
            await progress_callback(relative_path, status)
            return

        retries = 3
        for attempt in range(retries):
            try:
                await self._download_file(model_file, file_path, relative_path, progress_callback)
                model_file.download_count += 1
                self.db.update_model_file_stats(model_file)
                break
            except Exception as e:
                logging.error(f"Error downloading {model_file.name}: {e}")
                model_file.failure_count += 1
                model_file.failure_reason = str(e)
                self.db.update_model_file_stats(model_file)
                if attempt < retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue
                else:
                    status = DownloadStatus(DownloadStatusType.ERROR.value, 0, f"Failed to download {model_file.name}: {e}", False)
                    await progress_callback(relative_path, status)
                    break

    def create_model_path(self, model_name: str, model_directory: str, models_base_dir: str) -> tuple[str, str]:
        full_model_dir = os.path.join(models_base_dir, model_directory)
        os.makedirs(full_model_dir, exist_ok=True)
        file_path = os.path.join(full_model_dir, model_name)

        abs_file_path = os.path.abspath(file_path)
        abs_base_dir = os.path.abspath(str(models_base_dir))
        if os.path.commonprefix([abs_file_path, abs_base_dir]) != abs_base_dir:
            raise Exception(f"Invalid model directory: {model_directory}/{model_name}")

        relative_path = '/'.join([model_directory, model_name])
        return file_path, relative_path

    async def _download_file(self, model_file: ModelFile, file_path: str, relative_path: str, progress_callback: Callable[[str, DownloadStatus], Awaitable[Any]], chunk_size: int = 8192):
        headers = {}
        temp_file_path = file_path + ".part"
        downloaded = 0
        if os.path.exists(temp_file_path):
            downloaded = os.path.getsize(temp_file_path)
            headers['Range'] = f'bytes={downloaded}-'

        async with self.session.get(model_file.url, headers=headers) as response:
            if response.status == 200 or response.status == 206:
                total_size = int(response.headers.get('Content-Length', 0))
                total_size += downloaded  # Adjust total size if resuming
                last_update_time = time.time()

                async def update_progress():
                    nonlocal last_update_time
                    progress = (downloaded / total_size) * 100 if total_size > 0 else 0
                    status = DownloadStatus(DownloadStatusType.IN_PROGRESS.value, progress, f"Downloading {model_file.name}", False)
                    await progress_callback(relative_path, status)
                    last_update_time = time.time()

                with open(temp_file_path, 'ab') as f:
                    async for chunk in response.content.iter_chunked(chunk_size):
                        if chunk:
                            f.write(chunk)
                            downloaded += len(chunk)
                            if time.time() - last_update_time >= 1.0:
                                await update_progress()

                await update_progress()
                os.rename(temp_file_path, file_path)
                status = DownloadStatus(DownloadStatusType.COMPLETED.value, 100, f"Successfully downloaded {model_file.name}", False)
                await progress_callback(relative_path, status)
            elif response.status == 401:
                raise Exception("Authentication required")
            else:
                raise Exception(f"Failed to download {model_file.name}. Status code: {response.status}")

# Main function
async def main():
    # Initialize logging
    logging.basicConfig(level=logging.INFO)
    # Initialize database
    db = LocalDatabase()
    # Base directory for models
    models_base_dir = "models"
    # Initialize download manager
    download_manager = DownloadManager(models_base_dir, db)
    try:
        # Get repository URL from user input
        repo_url = input("Enter the repository URL: ").strip()
        # Fetch repository data
        repo = await fetch_repository_data(repo_url, db)
        # Display readme to user
        print(f"\nReadme for {repo.name}:\n{repo.readme}\n")
        # Display list of models
        print("Available models:")
        for idx, model_file in enumerate(repo.files, start=1):
            print(f"{idx}. {model_file.name} (Size: {model_file.size} bytes, Downloads: {model_file.download_count}, Failures: {model_file.failure_count})")
        # Ask user to select models to download
        selected_indices = input("\nEnter the numbers of the models to download (comma-separated), or 'all' to download all: ")
        if selected_indices.strip().lower() == 'all':
            selected_model_files = repo.files
        else:
            indices = [int(i.strip()) for i in selected_indices.split(',') if i.strip().isdigit()]
            selected_model_files = [repo.files[i - 1] for i in indices if 0 < i <= len(repo.files)]
        if not selected_model_files:
            print("No valid models selected. Exiting.")
            return
        # Download selected models
        async def progress_callback(model_name: str, status: DownloadStatus):
            print(f"{model_name}: {status.status} - {status.progress_percentage:.2f}% - {status.message}")

        await download_manager.download_models(selected_model_files, repo.name, progress_callback)
    finally:
        await download_manager.close()

if __name__ == "__main__":
    asyncio.run(main())
