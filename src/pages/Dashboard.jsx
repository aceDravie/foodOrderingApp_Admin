import React from "react";
import Widget from "../components/Widget";
import { Box, Grid } from "@mui/material";
import "../styles/dashboard.css";
import AllOrders from "../components/AllOrders";
import { Outlet } from "react-router-dom";
import MostPurchased from "../components/MostPurchased";
const Dashboard = () => {
  return (
    <Box my={5}>
      <div className="widgets">
        <Widget title="CUSTOMERS" collectionName="customers" />
        <Widget title="TOTAL REVENUE" collectionName="orders" />
        <Widget title="ORDERS" collectionName="orders" />
      </div>
      
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <AllOrders />
        </Grid>
        <Grid item xs={4}>
          <MostPurchased />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
