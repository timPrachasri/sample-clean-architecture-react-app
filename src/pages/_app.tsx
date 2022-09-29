import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import React from 'react'
import { AppBar, Footer } from '~/components/navigations'
import { AppProvider } from '~/providers'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <NextHead>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#3e80f1" />
        <meta name="theme-color" content="#3e80f1"></meta>
      </NextHead>
      <div data-theme="lemonade" className="flex flex-col min-w-full min-h-screen">
        <AppProvider>
          <AppBar />
          <Component {...pageProps} />
          <Footer />
        </AppProvider>
      </div>
    </>
  )
}

export default MyApp
