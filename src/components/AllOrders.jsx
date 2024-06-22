import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../helpers/firebase";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);

      // Fetch customer names
      const customerIds = [...new Set(ordersList.map((order) => order.clientId))];
      const customersCollection = collection(db, "customers");
      const customersSnapshot = await getDocs(
        query(customersCollection, where("id", "in", customerIds))
      );
      const customersMap = {};
      customersSnapshot.docs.forEach((doc) => {
        customersMap[doc.id] = doc.data().name;
      });
      setCustomers(customersMap);
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="orders table">
        <TableHead>
          <TableRow>
            <TableCell>Order Time</TableCell>
            <TableCell>Order Type</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatDate(order.orderTime)}</TableCell>
              <TableCell>{order.orderType}</TableCell>
              <TableCell>
                GHC {parseFloat(order.totalPrice).toFixed(2)}
              </TableCell>
              <TableCell>{customers[order.clientId] || "Unknown"}</TableCell>
              <TableCell>
                <Tooltip
                  title={
                    <>
                      <p>
                        <strong>Delivery Guy:</strong>{" "}
                        {order.deliveryGuy?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {order.location?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Orders:</strong>
                      </p>
                      {order.orders?.map((item, index) => (
                        <div key={index}>
                          {item.foodName} x {item.quantity} - GHC{" "}
                          {item.foodPrice.toFixed(2)}
                        </div>
                      ))}
                    </>
                  }
                >
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllOrders;