import React from "react";

const Product = ({ imageUrl, productUrl, product, handleClick }) => {
  const theProduct = (
    <div className="product">
      <img src={imageUrl} />
    </div>
	);
	// Dashboard version
  if (product)
    return (
      <a onClick={(e) => handleClick(e, product)} key={product._id}>
        {theProduct}
      </a>
		);
	// Live version
  return <a href={productUrl}>{theProduct}</a>;
};

export default Product;
