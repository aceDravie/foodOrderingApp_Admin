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
  Button,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { db } from "../helpers/firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportExcel = () => {
    console.log("excel printing");
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        Time: order.orderTime,
        "Order Type": order.orderType,
        "Total Price": order.totalPrice,
        "Customer Name": customers[order.clientId] || "Unknown",
        "DeliveryGuy Name": order.deliveryGuy?.name || "N/A",
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "Students Houses");
    XLSX.writeFile(workBook, "student-houseItems.xlsx");
  };

  const handleExportPDF = () => {
    console.log("pdf printing");

    const doc = new jsPDF();
    doc.text("All Orders", 20, 10);
    doc.autoTable({
      head: [["Time", "Type", "Price", "Customer Name", "DeliveryGuy Name"]],
      body: orders.map((order) => [
        order.orderTime,
        order.orderType,
        order.totalPrice,
        customers[order.clientId] || "Unknown",
        order.deliveryGuy?.name || "N/A",
      ]),
    });
    doc.save("Orders.pdf");
  };

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

  const showPrints = () => {};

  return (
    <>
      <div>
        <Button
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="contained"
          sx={{ mb: 2 }}
        >
          PRINT ORDERS
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleExportPDF}>
            <Button
              sx={{
                "&:hover": {
                  background: "#1565C0",
                  color: "white",
                },
              }}
            >
              PDF
            </Button>
          </MenuItem>
          <MenuItem onClick={handleExportExcel}>
            <Button
              sx={{
                "&:hover": {
                  background: "#1565C0",
                  color: "white",
                },
              }}
            >
              Excel
            </Button>
          </MenuItem>
        </Menu>
      </div>

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
                        <strong>Location:</strong>{" "}
                        {order.location?.name || "N/A"}
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
    </>
  );
};

export default AllOrders;
