import React from "react";

const Intro = () => (
  <div className="container intro">
    <div className="intro__content">
      {/* <h2>Create a professional resume the easy way.</h2>
      <p>
        Design your resume to fit your style, and export them to PDF once you're
        ready.
      </p> */}
      <h2>Create a resume that clicks with recruiters</h2>
      <p>
        {process.env.APP_NAME} builds resumes that allow you to express yourself
        while staying within the borders of what recruiters expect from a
        resume.
      </p>
    </div>
  </div>
);

export default Intro;
