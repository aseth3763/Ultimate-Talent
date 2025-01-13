const mongoose = require("mongoose")

const aboutSchema = new mongoose.Schema({
    aboutTitle: String,
    aboutDescription: String,
    aboutImage: String,  
  });
  
  const About = mongoose.model('About', aboutSchema);

  module.exports = About;
  