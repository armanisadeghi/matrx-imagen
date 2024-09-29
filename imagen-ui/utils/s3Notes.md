```sqlite-psql
-- Users table (managed by Supabase Auth)
-- This table is automatically created and managed by Supabase

-- User Groups
CREATE TABLE user_groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- User Group Membership
CREATE TABLE user_group_memberships (
  user_id UUID REFERENCES auth.users(id),
  group_id INTEGER REFERENCES user_groups(id),
  PRIMARY KEY (user_id, group_id)
);

-- S3 Buckets
CREATE TABLE s3_buckets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  base_path TEXT NOT NULL
);

-- S3 Access Policies
CREATE TABLE s3_access_policies (
  id SERIAL PRIMARY KEY,
  bucket_id INTEGER REFERENCES s3_buckets(id),
  path TEXT NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('read', 'write', 'read_write')),
  applies_to TEXT NOT NULL CHECK (applies_to IN ('public', 'group', 'user')),
  group_id INTEGER REFERENCES user_groups(id),
  user_id UUID REFERENCES auth.users(id),
  CONSTRAINT check_applies_to_consistency CHECK (
    (applies_to = 'public' AND group_id IS NULL AND user_id IS NULL) OR
    (applies_to = 'group' AND group_id IS NOT NULL AND user_id IS NULL) OR
    (applies_to = 'user' AND user_id IS NOT NULL AND group_id IS NULL)
  )
);

-- Example data
INSERT INTO user_groups (name) VALUES
  ('guest'), ('basic'), ('intermediate'), ('advanced'), ('admin');

INSERT INTO s3_buckets (name, region, base_path) VALUES
  ('main-data-bucket', 'us-west-2', '/data');

INSERT INTO s3_access_policies (bucket_id, path, access_type, applies_to, group_id, user_id)
VALUES
  (1, '/public', 'read', 'public', NULL, NULL),
  (1, '/shared', 'read_write', 'group', (SELECT id FROM user_groups WHERE name = 'basic'), NULL),
  (1, '/reports', 'read', 'group', (SELECT id FROM user_groups WHERE name = 'basic'), NULL),
  (1, '/intermediate', 'read_write', 'group', (SELECT id FROM user_groups WHERE name = 'intermediate'), NULL),
  (1, '/advanced', 'read_write', 'group', (SELECT id FROM user_groups WHERE name = 'advanced'), NULL),
  (1, '/', 'read_write', 'group', (SELECT id FROM user_groups WHERE name = 'admin'), NULL),
  (1, '/private', 'read_write', 'user', NULL, 'specific-user-uuid-here');
```
