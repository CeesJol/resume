import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children, transparentHeader }) => {
  return (
    <div>
      <Header transparentHeader={transparentHeader} />
      <div>
        <main>{children}</main>
      </div>
			<Footer />
    </div>
  )
}

export default Layout
