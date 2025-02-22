const http = require("http")
const server = http.createServer()
const express = require("express")
const dotenv = require("dotenv").config({path: "./.env"})
const indexRoutes = require("./routes/index")
const dbConnect = require("./config/db");
const cors = require('cors')

const {API_PORT, API_HOST, API_VERSION} = process.env

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.use(API_VERSION, indexRoutes)

app.use((req, res, next) => {
    return res.status(404).send(`Request not found`)
})

app.use((err, req, res, next) => {
    return res.status(500).send(`Something went wrong`)
})



app.listen(API_PORT, (err) => {
    try{
        if(err){
            throw err
        }

        const serverURL = `http://${API_HOST}:${API_PORT}`
        const apiURL = `${serverURL}${API_VERSION}`
        dbConnect()
        console.log(`Server running on port: ${API_PORT}`)
        console.log(`Server URL : ${serverURL}`)
        console.log(`API Url: ${apiURL}`)
        
    }catch(error){

    }
})





