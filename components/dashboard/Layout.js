import React, { useContext, useState, useEffect } from "react";
import { fauna } from "../../lib/api";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { toast } from "react-toastify";

const Layout = () => {
  const { editingResume, storeLayout, getLayout } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!filled && editingResume !== -1) {
      setFilled(true);

      setItems(getLayout());
    }
  });
  const handleChangeItem = (i) => {
    let newArr = [...items];
    newArr[i].value = event.target.value;
    setItems(newArr);
  };
  const handleUpdate = async (item) => {
    await fauna({
      type: "UPDATE_LAYOUT",
      id: item._id,
      data: {
        value: item.value,
      },
    }).then(
      (data) => {
        storeLayout(data.updateLayout);
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("updateLayout err:", err);
      }
    );
  };
  return editingResume !== -1 ? (
    items.map((item, i) => (
      <div className="dashboard__item" key={item._id}>
        <h4>{item.name}</h4>
        <form>
          <input
            type="text"
            id="value"
            name="value"
            value={item.value}
            onChange={() => handleChangeItem(i)}
          />

          <Button
            text="Update"
            altText="Updating..."
            fn={() => handleUpdate(item)}
          />
        </form>
      </div>
    ))
  ) : (
    <p>Select a resume to edit the layout</p>
  );
};

export default Layout;
