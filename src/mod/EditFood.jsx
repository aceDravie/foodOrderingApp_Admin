import React from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";

const EditFood = ({ open, onOpen, onClose }) => {
  const handleSubmit = () => {
    console.log("food Edited");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="form-dialog-title">PROFILE</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Avatar src="">
                
            </Avatar>
            <TextField
              required
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
            />

            <TextField
              required
              margin="dense"
              id="price"
              label="Price"
              type="text"
              fullWidth
            />
            <TextField
              required
              margin="dense"
              id="quantity"
              label="Quantity"
              type="text"
              fullWidth
            />
            
           
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Change
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default EditFood;
