import React from 'react';
import PropTypes from 'prop-types';

const renderPDFFooter = () => (
  <div
    id="pageFooter"
    style={{
      fontSize: '10px',
      color: '#666'
    }}
  >
    This is a sample footer
  </div>
);

const PDFLayout = ({ children, style }) => (
  <html>
    <head>
      <meta charSet="utf8" />
			{/* <link rel="stylesheet" href="http://localhost:3000/static/font-awesome-4.7.0/css/font-awesome.min.css" />
      <link rel="stylesheet" href="http://localhost:3000/static/pdf.css" /> */}
			{/* <style>
				{`${style}`}
			</style> */}
    </head>
    <body>
      {children}
      {renderPDFFooter()}
    </body>
  </html>
);

PDFLayout.propTypes = {
  children: PropTypes.node,
};

export default PDFLayout;
