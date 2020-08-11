import React, { useContext, useState, useEffect } from "react";
import { updateLayout } from "../../pages/api/fauna";
import { UserContext } from "../../contexts/userContext";
import Button from "../general/Button";
import { toast } from "react-toastify";

const Layout = () => {
  const { editingResume, storeLayout } = useContext(UserContext);
  const [filled, setFilled] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!filled && editingResume !== -1) {
      setFilled(true);

      setItems(editingResume.layout.data);
    }
  });
  const handleChangeItem = (i) => {
    let newArr = [...items];
    newArr[i].value = event.target.value;
    setItems(newArr);
  };
  const handleUpdate = async (i) => {
    await updateLayout(items[i]._id, {
      value: items[i].value,
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
      <div className="dashboard__item" key={i}>
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
            fn={() => handleUpdate(i)}
          />
        </form>
      </div>
    ))
  ) : (
    <p>Select a resume to edit the layout</p>
  );
};

export default Layout;
