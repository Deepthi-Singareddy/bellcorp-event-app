const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");



/*
========================================
ADD PRODUCT TO CART
POST /api/cart
========================================
*/
router.post("/", authMiddleware, async (req, res) => {

  try {

    const { productName, price } = req.body;

    // validation
    if (!productName || !price) {
      return res.status(400).json({
        message: "Product name and price required"
      });
    }

    // create cart item
    const newCartItem = new Cart({

      userId: req.user.id,
      productName: productName,
      price: price

    });

    // save to DB
    await newCartItem.save();

    res.status(201).json({

      message: "Item added to cart successfully",
      cartItem: newCartItem

    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});



/*
========================================
GET ALL CART ITEMS OF USER
GET /api/cart
========================================
*/
router.get("/", authMiddleware, async (req, res) => {

  try {

    const cartItems = await Cart.find({

      userId: req.user.id

    });

    res.status(200).json(cartItems);

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});



/*
========================================
DELETE CART ITEM
DELETE /api/cart/:id
========================================
*/
router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {

      return res.status(404).json({
        message: "Item not found"
      });

    }

    // check ownership
    if (cartItem.userId.toString() !== req.user.id) {

      return res.status(403).json({
        message: "Unauthorized"
      });

    }

    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      message: "Item removed from cart"
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


module.exports = router;
