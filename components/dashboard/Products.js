import React, { useContext }from "react";
import Product from "../../components/user/Product";
import { DashboardContext } from "../../contexts/dashboardContext";

export default (props) => {
	const { data, error, setEditingProduct } = useContext(DashboardContext);
	function handleClick(e, product) {
    e.preventDefault();
    setEditingProduct(product);
  }
  function drawItems() {
    if (!data) return <p>Loading...</p>;
    if (error || data === -1) return <p>Failed to load</p>;
    if (!data.userByEmail) return <p>404 - user not found</p>;

    const products = data.userByEmail.products.data;

    if (products.length > 0)
      return (
        <>
          <p>Click on any product to edit it</p>
          {products.map((product, i) => (
            <Product
              key={i}
              imageUrl={product.imageUrl}
              productUrl={product.productUrl}
              product={product}
              handleClick={handleClick}
            />
          ))}
        </>
      );
    return <p>Add a product to get started with your store</p>;
  }

  return (
    <div className="dashboard__products">
      <h4>Your products</h4>
      <div id="products-container">{drawItems()}</div>
    </div>
  );
};
