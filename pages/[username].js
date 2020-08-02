import { getUserItems } from "./api/fauna";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserLayout from "../components/user/UserLayout";
import Item from "../components/user/Item";

export default function User() {
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    // if (username && !data && !error) {
    //   console.log(`Req for ${username}`);
    //   getUserItems(username).then(
    //     (data) => {
    //       setData(data);
    //     },
    //     (error) => {
    //       setError(error);
    //     }
    //   );
    // }
  });

  function drawItems() {
    console.log("data [username]", data);
    if (!data) return <p>Loading...</p>;
    if (!data.userByUsername) return <p>404 - user not found</p>;
    // if (!data.userByUsername.confirmed)
    //   return <p>Confirm your email address to export your resume</p>;
    if (error || data === -1) return <p>Failed to load</p>;

    const items = data.userByUsername.items.data;

    if (items.length > 0)
      return (
        <>
          <p>Press any image to learn more</p>
          {items.map((item, i) => (
            <Item
              key={i}
              item={item}
            />
          ))}
        </>
      );
    return <p>This user has no items yet</p>;
  }

  return (
    <UserLayout name={username}>
      <div className="usercontainer">
        <div className="user">
          <div id="items-container">{drawItems()}</div>
        </div>
      </div>
    </UserLayout>
  );
}
