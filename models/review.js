const { string } = require("joi");
const mongoose = require("mongoose");
const { min } = require("../schema");
const schema = mongoose.Schema;

const reviewschema = new schema ({
  comment: {
    type: String,
  },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdat: {
        type: Date,
        default: Date.now(),
    },
    author: {
      type: schema.Types.ObjectId,
      ref: "User",
    }

});

 module.exports = mongoose.model("review", reviewschema);