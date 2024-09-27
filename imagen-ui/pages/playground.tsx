import React from 'react';
import { PlaygroundComponent } from '@/components/playground';
import type { NextPage } from 'next';
import type { ReactElement } from 'react';

const PlaygroundPage: NextPage & { getLayout?: (page: ReactElement) => ReactElement } = () => {
  return <PlaygroundComponent />;
};

PlaygroundPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default PlaygroundPage;