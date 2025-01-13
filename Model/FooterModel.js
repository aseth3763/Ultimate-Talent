const mongoose = require("mongoose")

const footerSchema = new mongoose.Schema({
    footerTitle: String,
    footerDescription: String,
    footerImage: String,  
  });
  
  const Footer = mongoose.model('Footer', footerSchema);

  module.exports = Footer