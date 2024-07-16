import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import CameraIcon from "@mui/icons-material/Camera";
import { auth, db, storage } from "../helpers/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { SetMeal } from "@mui/icons-material";

const AddFood = ({ open, onOpen, onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [ratings, setRatings] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [tempArray, setTempArray] = useState([]);
  const [_open, setOpen] = useState(false);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          //   setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = () => {};
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchCat = async () => {
      const q = query(collection(db, "category"));
      let catName = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         catName.push(doc.data().name);
      });
      setCategories(catName)
    };

    fetchCat();
  }, [categories]);

  const handleSubmit = async (e) => {
    setMessage("");
    e.preventDefault();

    console.log(tempArray);
    const foodData = {
      name,
      price: parseInt(price),
      quantity: parseInt(quantity),
      ratings: parseInt(ratings),
      image,
      category,
    };

    try {
      await addDoc(collection(db, "food"), foodData);
      setMessage("Food is added");
      setOpen(true);
      console.log("Food Added");

      setName("");
      setPrice("");
      setImage("");
      setQuantity("");
      setRatings("");
      setCategory("");
      onClose();
    } catch (error) {
      console.log("a error occcured", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="form-dialog-title">ADD FOOD</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box
              mb={3}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Avatar
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                sx={{ width: 90, height: 90 }}
              />
              <input
                id="image"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <IconButton>
                <label htmlFor="image">
                  <CameraIcon />
                </label>
              </IconButton>
            </Box>

            <TextField
              required
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              required
              margin="dense"
              id="price"
              label="Price"
              type="text"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="quantity"
              label="Quantity"
              type="text"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="ratings"
              label="Ratings"
              type="text"
              fullWidth
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((ele) => (
                  <MenuItem value={ele}>{ele}</MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default AddFood;
