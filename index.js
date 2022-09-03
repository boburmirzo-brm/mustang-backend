// @ts-nocheck
const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv/config")

const app = express();
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URL)
    .then(()=> console.log("Mongodb is connected"))
    .catch(()=> console.log("Mongodb is not connected"))

app.get('/', async(req,res)=> {
    res.send('App is running perfectly!')
})

app.use("/", async(req, res)=>{
    res.json("backend is warking successfully")
})
app.use("/sign-up", require("./router/login/sign-up"))
app.use("/sign-in", require("./router/login/sign-in"))
app.use("/products", require("./router/products/products"))
app.use("/orders", require("./router/orders/orders"))

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));