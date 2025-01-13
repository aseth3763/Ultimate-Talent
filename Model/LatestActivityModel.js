const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  activityName: {
    type: String,
  },
  typeOfActivity: {
    type: String,
  },
  dateOfActivity: {
    type: Date,
  },
  location: {
    type: String,
  },
   content : {
    type : String
  },
  summary : {
    type : String
  },
  activityImage: {
    type: String,
  },
  majorPoints : {
    type : String
  }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
