import React from "react";
import App from "next/app";
import Head from "next/head";
import UserContextProvider from "../contexts/userContext";
import { ToastContainer } from "react-toastify";

import "font-awesome/css/font-awesome.min.css";
import "react-image-crop/lib/ReactCrop.scss";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.scss";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        <div>
          <Head>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=UA-129727291-3"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());

									gtag('config', 'UA-129727291-3');
								`,
              }}
            />
            <link rel="shortcut icon" href="/images/icons/cur_icon.png" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>{process.env.APP_NAME}</title>
          </Head>
        </div>
        <UserContextProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </UserContextProvider>
      </div>
    );
  }
}

export default MyApp;
