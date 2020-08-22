import React from "react";
import App from "next/app";
import Head from "next/head";
import UserContextProvider from "../contexts/userContext";
import { ToastContainer } from "react-toastify";

import "../styles/index.scss";
import "font-awesome/css/font-awesome.min.css";
import "react-image-crop/lib/ReactCrop.scss";
import "react-toastify/dist/ReactToastify.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        <div>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Affilas</title>
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
