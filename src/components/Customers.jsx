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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { db } from "../helpers/firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
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
      customers.map((customer) => ({
        "Customer Name": customers[customer.clientId] || "Unknown",
        "Customer Email": customer.email,
        "Customer Contact": customer.contact,
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "Students Houses");
    XLSX.writeFile(workBook, "student-houseItems.xlsx");
  };

  const handleExportPDF = () => {
    console.log("pdf printing");

    const doc = new jsPDF();
    doc.text("All Customers", 20, 10);
    doc.autoTable({
      head: [["Name", "Email", "Contact"]],
      body: customers.map((customer) => [
        customers[customer.clientId] || "Unknown",
        customer.email,
        customer.contact,
        
        
      ]),
    });
    doc.save("Customers.pdf");
  };
  useEffect(() => {
    const customerCollection = collection(db, "customers");
    const q = query(customerCollection);

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const customerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch customer names for each customer
      const customerPromises = customerList.map(async (customer) => {
        if (customer.clientId && !customers[customer.clientId]) {
          const customerDoc = await getDoc(
            doc(db, "customers", customer.clientId)
          );
          if (customerDoc.exists()) {
            return { [customer.clientId]: customerDoc.data().name };
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
      setOrders(customerList);
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
              <TableCell>Customer Name</TableCell>
              <TableCell>Customer Email</TableCell>
              <TableCell>Customer Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  {customers[customer.clientId] || "Unknown"}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                {customer.contact}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Customers;
