import React from "react";
import App from "next/app";
import Head from "next/head";
import UserContextProvider from "../contexts/userContext";

import "../styles/index.scss";
import 'react-image-crop/lib/ReactCrop.scss';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        <div>
          <Head>
            <title>Affilas</title>
          </Head>
        </div>
				<UserContextProvider>
          <Component {...pageProps} />
				</UserContextProvider>
      </div>
    );
  }
}

export default MyApp;
