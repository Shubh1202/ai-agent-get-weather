const mongoose = require("mongoose")

const dbConnect = (async() => {
    try{
        const connectionString = process.env.DB_URI
        const isConnect = await mongoose.connect(connectionString)

        if(isConnect) 
             console.log(`Database connected successfully`) 
        else
            throw new Error(`Database connection failed`)

    }catch(error){
        throw error
    }
})

module.exports = dbConnect