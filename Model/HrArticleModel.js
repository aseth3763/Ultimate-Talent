const mongoose = require("mongoose");
const { Schema } = mongoose;

const hrArticleSchema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    publicationDate: {
      type: Date,
    },
    content : {
      type : String
    },
    articleCategory : {
      type : String
    },
    summary : {
      type : String
    },
    articleImage: {
      type: String,
    },
    majorPoints : {
      type : String
    }
  },
  { timestamps: true }
);

const hrArticleModel = mongoose.model("hrArticle", hrArticleSchema);

module.exports = hrArticleModel;
