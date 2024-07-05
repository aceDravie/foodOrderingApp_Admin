import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../helpers/firebase";

const AddFoodCategory = ({ open, onOpen, onClose }) => {
  const [_open, setOpen] = useState(false);
  const [catName, setCatName] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    setMessage("");
    e.preventDefault();

    const foodData = {
      name: catName
    };

    try {
      await addDoc(collection(db, "category"), foodData);
      setMessage("Category is added");
      setOpen(true);
      console.log("Food Added");
      onClose();
    } catch (error) {
      console.log("a error occcured", error);
    }
  };
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="form-dialog-title">ADD FOOD CATEGORY</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              required
              margin="dense"
              id="catName"
              label="Category Name"
              type="text"
              value={catName}
              fullWidth
              onChange={(e) => setCatName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color="error" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="success" variant="outlined">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={_open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
    </>
  );
};

export default AddFoodCategory;
