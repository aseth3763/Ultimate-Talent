const express = require("express")
const app = express()
const bodyParser = require("body-parser")
require("dotenv").config()
require("./db")
const cors = require("cors")

app.use(cors())

app.use(bodyParser.json())

app.use(express.static("Upload"))

app.get("/",(req,res)=>{
    res.send("Arigato Gozaimasu")
})

const jobVacancyRouter= require('./Router/consultancyRouter')
app.use("/api",jobVacancyRouter)

const adminRouter = require("./Router/adminRouter")
app.use("/admin",adminRouter)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
    });

const port = process.env.port || 3000

app.listen(port,()=>{
    console.log(`Server listening on Port : ${port}`)
})

