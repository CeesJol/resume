import React from "react";
import Link from "next/link";

const UserFooter = () => (
  <Link href="/">
    <footer className="userfooter">
      <div className="userfooter__content">
        <h4>
          <Link href="/">
            <a>Affilas</a>
          </Link>
        </h4>
      </div>
    </footer>
  </Link>
);

export default UserFooter;
