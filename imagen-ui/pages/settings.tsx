import React from 'react';
import { SettingsComponent } from '@/components/settings';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

const SettingsPage: NextPageWithLayout = () => {
  return <SettingsComponent />;
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default SettingsPage;