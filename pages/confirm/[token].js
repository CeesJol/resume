import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fauna } from "../../lib/api";

const Token = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState("Confirming...");

  useEffect(() => {
    if (token) {
      console.log("token", token);
      // Decode the token
      try {
        fauna({ type: "CONFIRM_USER", token }).then(
          (data) => {
            console.log("data [token]", data);
            setStatus(
              "Email confirmed successfully! You can close this tab now."
            );
          },
          (err) => {
            console.error("err", err);
            setStatus(
              "Something went wrong. Please contact us for help. " + err
            );
          }
        );
      } catch (e) {
        console.log("Token confirmation error", e);
        setStatus("Something went wrong. Please contact us for help. " + err);
      }
    }
  }, [token]);

  return <>{status}</>;
};

export default Token;
