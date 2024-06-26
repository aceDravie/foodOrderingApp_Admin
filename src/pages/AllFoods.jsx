import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Avatar,
} from "@mui/material";
import { db } from "../helpers/firebase";
import {
  collection,
  query,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditFood from "../mod/EditFood";
import AddFood from "../mod/AddFood";

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [openEditFood, setOpenEditFood] = useState(false);
  const [openAddFood, setOpenAddFood] = useState(false);

  const handleOpenEditFood = () => {
    setOpenEditFood(true);
  };

  const handleCloseEditFood = () => {
    setOpenEditFood(false);
  };
  const handleOpenAddFood = () => {
    setOpenAddFood(true);
  };

  const handleCloseAddFood = () => {
    setOpenAddFood(false);
  };

  useEffect(() => {
    const q = query(collection(db, "food"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let foodList = [];
        querySnapshot.forEach((doc) => {
          foodList.push({ id: doc.id, ...doc.data() });
        });

        setFoods(foodList);
      },
      (error) => {
        console.error("Error fetching foods:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const deleteFood = async (id) => {
    console.log("deleted food with id", id);
    await deleteDoc(doc(db, "food", id));
  };
  return (
    <>
      <div
        className="head"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          ALL FOODS
        </Typography>
        <Button>
          <IconButton onClick={handleOpenAddFood}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Button>
      </div>

      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>Image</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Name</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Price</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Ratings</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Avatar
                      src={food.image}
                      sx={{ width: 30, height: 30 }}
                    ></Avatar>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {food.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    GHC {food.price}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {food.quantity || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {food.ratings || "Not Rated"}
                  </TableCell>
                  <TableCell
                    sx={{ justifyContent: "center", display: "flex", gap: 1 }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleOpenEditFood}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={(e) => deleteFood(food.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <EditFood
        open={openEditFood}
        onOpen={handleOpenEditFood}
        onClose={handleCloseEditFood}
      />
      <AddFood
        open={openAddFood}
        onOpen={handleOpenAddFood}
        onClose={handleCloseAddFood}
      />
    </>
  );
};

export default AllFoods;
