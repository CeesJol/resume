import Link from "next/link"

import UserHeader from "./UserHeader"
import UserFooter from "./UserFooter"

const UserLayout = ({ children, name }) => {
  return (
    <div>
      <UserHeader name={name} />
      <div>
        <main>{children}</main>
      </div>
			<UserFooter />
    </div>
  )
}

export default UserLayout
