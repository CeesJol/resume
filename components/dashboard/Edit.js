import React, { useState, useEffect, useContext } from "react";
import Button from "../general/Button";
import { updateProduct, deleteProduct } from "../../pages/api/fauna";
import { DashboardContext } from "../../contexts/dashboardContext";

export default function Edit(props) {
	const [productUrl, setProductUrl] = useState("");
	const { editingProduct, handleMutation } = useContext(DashboardContext);
  const handleChangeProductUrl = (event) => {
    setProductUrl(event.target.value);
  };
  const handleSave = async (event) => {
    if (event) event.preventDefault();
    await updateProduct(editingProduct._id, productUrl, editingProduct.imageUrl).then(
      () => {
        // Communicate refresh to Dashboard (parent)
        handleMutation();
      },
      (err) => {
        console.log("err", err);
      }
    );
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();
    await deleteProduct(editingProduct._id).then(
      () => {
        // Communicate refresh to Dashboard (parent)
        handleMutation();
      },
      (err) => {
        console.log("err", err);
      }
    );
  };
  useEffect(() => {
    setProductUrl(editingProduct.productUrl);
  }, []);
  return (
    <>
      <div className="dashboard__create">
        <h4 className="dashboard__create--title">Edit a product</h4>
        <form>
          <label>Product URL</label>
          <input
            type="text"
            id="productUrl"
            name="productUrl"
            value={productUrl}
            onChange={handleChangeProductUrl}
          />

          {status && <p>{status}</p>}

          <Button text="Save" fn={handleSave} />
          <Button text="Delete" fn={handleDelete} color="red" />
        </form>
      </div>
    </>
  );
}
