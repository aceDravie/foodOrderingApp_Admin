import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../helpers/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MostPurchased = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "food")); // Adjust the collection name as needed
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const purchasesData = {};
      querySnapshot.forEach((doc) => {
        const { name, count } = doc.data();
        if (purchasesData[name]) {
          purchasesData[name] += count;
        } else {
          purchasesData[name] = count;
        }
      });

      const formattedData = Object.entries(purchasesData).map(
        ([name, count]) => ({
          name,
          count,
        })
      );

      setData(formattedData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Most Purchased</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostPurchased;
