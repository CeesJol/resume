import React, {useState} from "react";
import Router from "next/router";

// import Image from "./image"
import Wave from "../general/Wave";
import Button from "../general/Button";

const Splash = () => {
	const [email, setEmail] = useState("");
	const handleChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };
  return (
    <>
      <div className="splash">
        <div className="splash__workable-content">
          <div className="splash__content">
            <div className="splash__left">
              <div>
                <h1 className="splash__content--title">
                  Create a professional resume in minutes
                </h1>
								<p>Affilas is an online resume builder that creates resumes quickly.</p>
                {/* <p>
                Affilas allows you to build a custom resume in minutes.
              </p> */}
              </div>
              <footer>
                {/* <Button /> */}
                <form style={{ display: "flex" }}>
                  <input
                    type="text"
										id="email"
										name="email"
                    value={email}
                    onChange={handleChangeEmail}
                    placeholder="Email"
                    style={{
                      minWidth: "0px",
                      width: "auto",
                      display: "inline-block",
                      marginRight: "1rem",
                      flexGrow: "1",
                    }}
                  />
                  <Button
                    text="Start now"
                    fn={() => Router.push(`/signup?email=${email}`)}
                  />
                </form>
              </footer>
            </div>
            <div className="splash__right">
              <img src="/images/undraw_order_confirmed_aaw7.svg" />
            </div>
          </div>
        </div>
      </div>
      <Wave />
    </>
  );
};

export default Splash;
