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
import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { db } from "../helpers/firebase";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection);

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch customer names for each order
      const customerPromises = ordersList.map(async (order) => {
        if (order.clientId && !customers[order.clientId]) {
          const customerDoc = await getDoc(
            doc(db, "customers", order.clientId)
          );
          if (customerDoc.exists()) {
            return { [order.clientId]: customerDoc.data().name };
          }
        }
        return null;
      });

      const customerResults = await Promise.all(customerPromises);
      const newCustomers = Object.assign(
        {},
        ...customerResults.filter(Boolean)
      );

      setCustomers((prevCustomers) => ({ ...prevCustomers, ...newCustomers }));
      setOrders(ordersList);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
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
                    <React.Fragment>
                      <strong>Delivery Guy:</strong>{" "}
                      {order.deliveryGuy?.name || "N/A"}
                      <br />
                      <strong>Location:</strong> {order.location?.name || "N/A"}
                      <br />
                      <strong>Orders:</strong>
                      <ul>
                        {order.orders?.map((item, index) => (
                          <li key={index}>
                            {item.foodName} x {item.quantity} - GHC{" "}
                            {item.foodPrice.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </React.Fragment>
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
