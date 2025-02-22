const express = require("express")
const route = express.Router()
const weatherController = require("../controllers/weather")

route.get("/", weatherController.getWeather)

module.exports = route