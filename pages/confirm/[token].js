import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fauna } from "../../lib/api";

const Token = () => {
  const router = useRouter();
  const { token } = router.query;
  const [confStatus, setConfStatus] = useState("Confirming...");

  useEffect(() => {
    if (token) {
      console.info("token", token);
      // Decode the token
      try {
        fauna({ type: "CONFIRM_USER", token }).then(
          (data) => {
            console.info("data [token]", data);
            setConfStatus(
              "Email confirmed successfully! You can close this tab now."
            );
          },
          (err) => {
            console.error("err", err);
            setConfStatus(
              "Something went wrong. Please contact us for help. " + err
            );
          }
        );
      } catch (e) {
        console.error("Token confirmation error", e);
        setConfStatus(
          "Something went wrong. Please contact us for help. " + err
        );
      }
    }
  }, [token]);

  return <>{confStatus}</>;
};

export default Token;
