const mongoose = require("mongoose");


/*
========================================
Cart Schema
========================================
*/

const cartSchema = new mongoose.Schema({

  // user reference
  userId: {

    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true

  },


  // product name
  productName: {

    type: String,
    required: true,
    trim: true

  },


  // product price
  price: {

    type: Number,
    required: true

  },


  // quantity (optional, default = 1)
  quantity: {

    type: Number,
    default: 1

  },


  // created time
  createdAt: {

    type: Date,
    default: Date.now

  }

});


/*
========================================
Export Model
========================================
*/

module.exports = mongoose.model("Cart", cartSchema);
