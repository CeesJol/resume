import React, { useState, useContext } from "react";
import ReactCrop from "react-image-crop";
import Button from "../general/Button";
import { clearInputFile, getCroppedImg, compressImg, convert } from "../../lib/image";
import { createProduct } from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import { DashboardContext } from "../../contexts/dashboardContext";
import { validateWebsite } from "../../lib/validate";

export default function Add(props) {
  const [productUrl, setProductUrl] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);
	const [crop, setCrop] = useState({ aspect: 1 });
	const fileInput = React.createRef();
	const { getUser } = useContext(UserContext);
	const { getProducts } = useContext(DashboardContext);
  const handleChangeProductUrl = (event) => {
    setProductUrl(event.target.value);
  };
  const handleSetImage = async (event) => {
    setCrop({ aspect: 1 });
    setFile(await convert(event.target.files[0]));
  };
  const resetForm = () => {
    setProductUrl("");
    setStatus("");
    setFile(null);
    setCrop({ aspect: 1 });
    clearInputFile(document.getElementById("image"));
  };
  const getImage = () => document.getElementsByClassName("ReactCrop__image")[0];
  /**
   * Upload the product
   */
  const handleCreate = async (event) => {
    if (event) event.preventDefault();
    if (!crop || (crop && !crop.width)) {
      setStatus("Please upload and crop an image first");
      return;
    }
    const validationError = validateWebsite(productUrl);
    if (validationError) {
      setStatus(validationError);
      return;
    }
    // Crop, compress, convert to base64
    const croppedImg = await getCroppedImg(getImage(), crop, "hello");
    const compressedImg = await compressImg(croppedImg);
    const convertedImg = await convert(compressedImg);
    const imageUrl = convertedImg;
    await createProduct(getUser(), productUrl, imageUrl).then(
      (data) => {
        setStatus("Created product successfully!");
        console.log("Created product");

        // Reset state
        resetForm();

        // Communicate refresh to Dashboard (parent)
        getProducts();
      },
      (err) => {
        setStatus("Something went wrong. Please try again later");
        console.log("err", err);
      }
    );
  };
  return (
    <div className="dashboard__create">
      <h4 className="dashboard__create--title">Add a product</h4>
      <form>
        <label>Product URL</label>
        <input
          type="text"
          id="productUrl"
          name="productUrl"
          value={productUrl}
          onChange={handleChangeProductUrl}
        />

        <label>Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleSetImage}
          ref={fileInput}
        />

        {status && <p>{status}</p>}

        {file && (
          <>
            <p>Crop the image to upload it</p>
            <div style={{ width: "40rem" }}>
              <ReactCrop
                src={file}
                crop={crop}
                style={{ position: "relative" }}
                onChange={(newCrop) => {
                  setCrop(newCrop);
                }}
              />
              <br />
            </div>
          </>
        )}

        <Button text="Add new product" fn={handleCreate} />
      </form>
    </div>
  );
}
