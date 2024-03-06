const express = require("express");
const { default: mongoose } = require("mongoose");
const { findClosestEmployeeGroupByGeospatial } = require("./EmployeeController");

const PORT = 5000;
const server = express();

mongoose.connect("mongodb+srv://umairnajeeb:umairnajeeb1@cluster0.t2hsbpq.mongodb.net/GeoTest?retryWrites=true&w=majority").then(() => console.log("conntect to DB"))

server.use(express.json())
server.use(express.urlencoded({extended:false}))

// server.post("/getNearest", findClosestEmployeeGroup)
// server.post("/getNearest", findClosestEmployeeGroupByGeospatial)
server.post("/makeRoster", findClosestEmployeeGroupByGeospatial)

server.listen(PORT, () => {
    console.log(`server deployed on http://localhost:${PORT}`)
})