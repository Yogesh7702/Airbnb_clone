const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingschema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
      url: String,
      filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  
  country: {
    type: String,
  },

  reviews:  [
   {
    type: Schema.Types.ObjectId,
    ref: "review",
  },
 ],

   owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
   }
});

  listingschema.post("findOneAndDelete", async(listing) => {
    if(listing) {
       await Review.deleteMany({_id : {$in : listing.reviews}});
    }
  });

const listing = mongoose.model("listing", listingschema);
module.exports = listing;
