import React, { useState, useEffect, useContext } from "react";

import Resume from "../components/dashboard/Resume";
import PDFLayout from "../components/pdf/PDFLayout";
import pdfHelper from "../lib/pdfHelper";

import UserContextProvider from "../contexts/userContext";

const IndexPage = () => {
  useEffect(() => {
    console.log("fucker");
  });
  return <Resume />;
};

export async function getServerSideProps({ req, res, query }) {
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>WOIJEGIOWEG!!!!!!')
  const exportPDF = query.exportPDF === "true";
  const isServer = !!req;

  if (isServer && exportPDF) {
    const buffer = await pdfHelper.componentToPDFBuffer(
      <PDFLayout>
        <Resume />
      </PDFLayout>
    );

    // with this header, your browser will prompt you to download the file
    // without this header, your browse will open the pdf directly
    res.setHeader("Content-disposition", 'attachment; filename="article.pdf');

    // set content type
    res.setHeader("Content-Type", "application/pdf");

    // output the pdf buffer. once res.end is triggered, it won't trigger the render method
    res.end(buffer);
  }

  return {
    props: {}, // will be passed to the page component as props
  }
};

export default IndexPage;
