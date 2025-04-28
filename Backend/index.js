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
app.use(cors({origin:process.env.FRONTEND || 'http://localhost:80', credentials: true}));

app.use('/api', router);

app.get('/', (req,res) => {
    res.send("API WORKING")
})


app.listen(port, () => {
    console.log(`Server Started at Port: ${port}`)
}) 

