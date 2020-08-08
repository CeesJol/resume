import React, { Component } from "react";
import Dashboard from "../components/dashboard/Dashboard";

import Resume from "../components/dashboard/Resume";
import PDFLayout from "../components/pdf/PDFLayout";
import pdfHelper from "../lib/pdfHelper";

import UserContextProvider from "../contexts/userContext";

import { getResume } from "./api/fauna";

import Router from "next/router";

class DashboardPage extends Component {
  render() {
    return <Dashboard />;
  }
}

function getCookie(cname, location) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(location);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// export async function getServerSideProps({ req, res, query }) {
DashboardPage.getInitialProps = async function({ req, res, query }) {
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>WOIJEGIOWEG!!!!!!')
  const exportPDF = query.exportPDF === "true";
	const isServer = !!req;
	console.log('exportPdf', exportPDF, 'isServer', isServer);

	const resumeId  = getCookie('resumeId', req.headers.cookie)
	console.log('resumeId', resumeId);

  if (isServer && exportPDF) {
		const resumeData = await getResume(resumeId);
		console.log('resumeData style:', resumeData.findResumeByID.template.style)
		
    const buffer = await pdfHelper.componentToPDFBuffer(
      <PDFLayout style={resumeData.findResumeByID.template.style}>
				<UserContextProvider>
        	<Resume data={resumeData.findResumeByID} />
				</UserContextProvider>
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

export default DashboardPage;
