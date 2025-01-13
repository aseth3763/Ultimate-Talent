const mongoose = require("mongoose")

const otpUserSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    otp : {
        type : Number
    }
},{timestamps:true})

const otpUserModel = mongoose.model("otpUser",otpUserSchema)

module.exports= otpUserModel