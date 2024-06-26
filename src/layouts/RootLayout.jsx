import React from "react";
import { Container, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Widget from "../components/Widget";

const RootLayout = () => {
  return (
    <Box>
      <Navbar />

      <Box my={3}>
        <div className="widgets">
          <Widget title="CUSTOMERS" collectionName="customers" />
          <Widget title="TOTAL REVENUE" collectionName="orders" />
          <Widget title="ORDERS" collectionName="orders" />
        </div>
      </Box>

      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
};

export default RootLayout;
