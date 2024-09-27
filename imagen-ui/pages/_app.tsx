// imagen-ui/pages/_app.tsx

import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Providers } from '@/components/providers';
import path from 'path';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  useEffect(() => {
    console.log('App root directory:', process.cwd());
  }, []);
  useEffect(() => {
    console.log('Current Directory:', process.cwd());
    console.log('Resolved Path:', path.resolve('./'));
  }, []);
  
  return (
    <Providers>
      {getLayout(<Component {...pageProps} />)}
    </Providers>
  );
}

export default MyApp;
