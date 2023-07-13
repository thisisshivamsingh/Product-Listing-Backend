const mongoose = require("mongoose");
// const fs = require("fs");

// READ JSON FILE
// const product = JSON.parse(fs.readFileSync(`${__dirname}/data/product.json`));

const collection = mongoose.connection.collection("electricity");

// collection
//   .insertMany(product[0].electricity)
//   .then((result) => {
//     console.log("Documents created successfully:", result);

//   })
//   .catch((error) => {
//     console.error("Error creating documents:", error);
//   });

exports.getProduct = async (req, res, next) => {
  try {
    // Find documents in the collection
    const documents = await collection.find().toArray();

    res.status(200).json({
      status: 1,
      message: "Plan(s) found successfully.",
      data: { electricity: documents },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
