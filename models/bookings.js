const mongoose = require("mongoose")


const bookingSchema = new mongoose.Schema({
    bookingId:{
        type: String, 
        default: null
    },
    bookingType:{
        type: String,
        default: null
    },
    bookingSpecialization: {
        type: String,
        default: null
    },
    patient:{
        type: String,
        default: null
    },
    email:{
        type: String,
        default: null
    },
    phone:{
        type: String,
        default: null
    }
},
{
    timestamps: true
})

const bookingModel = mongoose.model("booking", bookingSchema)
module.exports = bookingModel