const express = require("express")
const router = express.Router()
const weatherRoute = require("./weather")
const bookingRoute = require("./booking")


router.use("/weather", weatherRoute)
router.use("/booking", bookingRoute)

module.exports = router