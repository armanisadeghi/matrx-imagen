import React from 'react';

import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { SignupComponent } from '@/components/singup';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

const SignupPage: NextPageWithLayout = () => {
  return <SignupComponent />;
};

SignupPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default SignupPage;