const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  bannerTitle: String,
  bannerDescription: String,
  bannerImage: String,  
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;