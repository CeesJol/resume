import React, { useContext } from "react";
import Product from "../../components/user/Product";
import { DashboardContext } from "../../contexts/dashboardContext";

export default (props) => {
  const { editingProduct, data, error } = useContext(DashboardContext);
  function drawItem(drawProduct) {
    if (!data) return <p>Loading...</p>;
    if (error || data === -1) return <p>Failed to load</p>;
    if (!data.userByEmail) return <p>404 - user not found</p>;

    const products = data.userByEmail.products.data;

    if (products.length > 0) {
      // TODO does find work for SEO does it even matter and stuff or am i just bitching
      const product = products.find(
        (product) => product._id == drawProduct._id
      );
      if (!product) return <p>Something went wrong</p>;

      return (
        <Product
          imageUrl={product.imageUrl}
          productUrl={product.productUrl}
          product={product}
          handleClick={() => {}}
        />
      );
    }
    return <p>Add a product to get started with your store</p>;
  }

  return (
    <div className="dashboard__preview">
      <h4>Preview</h4>
      <p>Preview of the product</p>
      {drawItem(editingProduct)}
    </div>
  );
};
