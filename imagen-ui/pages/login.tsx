import React from 'react';
import { LoginComponent } from '@/components/login'; // Adjust the import path as needed
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

const LoginPage: NextPageWithLayout = () => {
  return <LoginComponent />;
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default LoginPage;