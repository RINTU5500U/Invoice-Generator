const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config();
const route = require("./src/routes/route")
const app = express()

app.use(express.json())

mongoose.connect(`mongodb+srv://BiswajitSwain:${process.env.MONGODB_PASSWORD}@cluster0.xf1eq.mongodb.net/invoice_generator`,
    { usenewUrlParser: true })
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err.message))

app.use("/", route)

app.listen(3000, () => {
    console.log("Express is running on port " + 3000)
})
