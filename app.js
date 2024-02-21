require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const route = require("./src/routes/route")
const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err.message))

app.use("/", route)

app.listen(PORT, () => {
    console.log("Express is running on port " + PORT)
})
