const mongoose = require("mongoose")

const OtpClientSchema = new mongoose.Schema({
    clientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Client"
    },
    otp : {
        type : Number
    }
},{timestamps:true})

const OtpClientModel = mongoose.model("otpClient",OtpClientSchema)

module.exports = OtpClientModel