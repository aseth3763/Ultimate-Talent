const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    adminId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "admin"
    },
    otp : {
        type : Number,
        required : true
    }
},{timestamps:true})

const otpModel = mongoose.model("otp",otpSchema)

module.exports = otpModel