import express, { Router } from "express";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import cors from "cors";
import connectDb from "./config/mongodb.js";
import router from "./Routes/index.js";


connectDb()

const port = process.env.PORT || 4000
const app = express()



app.use(express.json());
app.use(cookieParser());
app.use(cors({Credential: true}));

app.use('api/v1/', Router);


app.get("/", (req, res) => {
    res.send("Server is working")
})

app.listen(port, () => {
    console.log(`Server Started at Port: ${port}`)
}) 

