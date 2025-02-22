const express = require("express")
const route = express.Router()
const bookingController = require("../controllers/booking")

route.post("/", bookingController.createBooking)

module.exports = route