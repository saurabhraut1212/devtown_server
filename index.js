import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db/dbConfig.js";

const PORT = process.env.PORT || 8000;

import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"


const app = express();

//middlewares
dotenv.config();
app.use(express.json());
app.use(cors());

//database connection
dbConnect();


app.get("/", (req, res) => {
    res.send("Server started")
})

//api routes
app.use("/auth", userRoutes);
app.use("/task", taskRoutes);



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})