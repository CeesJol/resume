import React from "react";

import Arguments from "../components/index/Arguments";
import Intro from "../components/index/Intro";
import CTA from "../components/index/CTA";
import Idea from "../components/index/Idea";
import Niche from "../components/index/Niche";
import Splash from "../components/index/Splash";
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";

const IndexPage = () => {
  return (
    <>
      <Header transparentHeader={true} />
      <main>
        <Splash />
        <Intro />
        <Idea />
        <Arguments />
        <Niche />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default IndexPage;
