 const mongoose = require("mongoose");
 const initdata  = require("./data.js");
 const listing = require("../models/listing.js");

 const mongo_url = ('mongodb://127.0.0.1:27017/wonderful');

 main()
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log(err);
    });

    async function main() {
      await mongoose.connect(mongo_url);
    }

    const initdb = async () => {
  try {
    await listing.deleteMany({});
     const userId = "68e7ae2d66f4675cdc12660a";
    const updatedData = initdata.map((obj) => ({
      ...obj,
      owner: userId,
    }));
    await listing.insertMany(updatedData);
    console.log("✅ Sample data inserted successfully");
  } catch (err) {
    console.log("❌ Error inserting data:", err);
  }
};

main().then(initdb);