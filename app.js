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


// how many instance we can create
// about instance bill 
// nginx
// ci/cd tool
// route 53
// cloud front

// Console sign-in URL

// https://637423536090.signin.aws.amazon.com/console
// User name

// biswajit
// Console password

// }oP8Rp2$