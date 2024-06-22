import React from "react";
import Widget from "../components/Widget";
import { Box } from "@mui/material";
import "../styles/dashboard.css";
import AllOrders from "../components/AllOrders";
import { Outlet } from "react-router-dom";
const Dashboard = () => {
  return (
    <Box my={5}>
      <div className="widgets">
        <Widget title="CUSTOMERS" collectionName="customers" />
        <Widget title="TOTAL REVENUE" collectionName="orders" />
        <Widget title="ORDERS" collectionName="orders" />
      </div>
      <AllOrders />
    </Box>
  );
};

export default Dashboard;
