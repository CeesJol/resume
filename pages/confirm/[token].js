import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { confirm } from "../api/confirm";

export default function Token() {
  const router = useRouter();
  const { token } = router.query;
	const [status, setStatus] = useState("Confirming...");

  useEffect(() => {
    if (token) {
      confirm(token).then(
        (data) => {
					console.log("data", data);
					setStatus("Email confirmed successfully! You can close this tab now.");
        },
        (err) => {
          console.log("err", err);
          setStatus("Something went wrong. Please contact us for help. " + err);
        }
      );
    }
  }, [token]);

  return <>{status}</>;
}
