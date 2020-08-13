import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { confirm } from "../../lib/api";

const Token = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState("Confirming...");

  useEffect(() => {
    if (token) {
			console.log('token', token);
      confirm({ type: 'CONFIRM', token }).then(
        (data) => {
          console.log("data [token]", data);
          setStatus(
            "Email confirmed successfully! You can close this tab now."
          );
        },
        (err) => {
          console.error("err", err);
          setStatus("Something went wrong. Please contact us for help. " + err);
        }
      );
    }
  }, [token]);

  return <>{status}</>;
};

export default Token;
