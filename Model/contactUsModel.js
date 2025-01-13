const mongoose = require("mongoose")

const contactUsSchema = new mongoose.Schema({
    clientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "client"
    },
    name : {
        type : String
    },
    phoneNo : {
        type : Number
    },
    email  : {
        type : String
    },
    subject : {
        type : String
    },
    message :  {
        type : String
    },
},{timestamps:true})

const contactUsModel = mongoose.model("contactUs",contactUsSchema)

module.exports = contactUsModel