import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../helpers/firebase";
import "../styles/widget.css";

const Widget = ({ title, collectionName }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, collectionName));
      const querySnapshot = await getDocs(q);

      if (title === "TOTAL REVENUE") {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const totalPrice = doc.data().totalPrice;
          total += parseFloat(totalPrice) || 0;
        });
        setValue(total);
      } else {
        setValue(querySnapshot.size);
      }
    };

    fetchData();
  }, [collectionName, title]);

  let data;
  switch (title) {
    case "CUSTOMERS":
      data = {
        icon: <PersonOutlinedIcon className="icon" />,
        link: "See all customers",
        bgColor: "#e3f2fd", // Light blue
      };
      break;
    case "TOTAL REVENUE":
      data = {
        icon: <MonetizationOnOutlinedIcon className="icon" />,
        link: "View revenue details",
        bgColor: "#e8f5e9", 
      };
      break;
    case "ORDERS":
      data = {
        icon: <ShoppingCartOutlinedIcon className="icon" />,
        link: "View all orders",
        bgColor: "#fff3e0", // Light orange
      };
      break;
    default:
      data = {
        icon: <PersonOutlinedIcon className="icon" />,
        link: "See details",
        bgColor: "#f3e5f5", // Light purple
      };
  }

  const iconStyle = {
    backgroundColor: data.bgColor,
    borderRadius: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{title}</span>
        <span className="counter">
          {title === "TOTAL REVENUE" ? `GHC ${value.toFixed(2)}` : value}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {"20 %"}
        </div>
        <div style={iconStyle}>{data.icon}</div>
      </div>
    </div>
  );
};

export default Widget;
