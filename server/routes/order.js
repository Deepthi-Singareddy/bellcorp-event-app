const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");

const authMiddleware = require("../middleware/authMiddleware");


/*
========================================
PLACE ORDER
POST /api/order
========================================
*/

router.post("/", authMiddleware, async (req, res) => {

  try {

    // get user's cart items
    const cartItems = await Cart.find({
      userId: req.user.id
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }


    // calculate total
    let totalAmount = 0;

    cartItems.forEach(item => {
      totalAmount += item.price * item.quantity;
    });


    // create order
    const newOrder = new Order({

      userId: req.user.id,

      items: cartItems.map(item => ({
        productName: item.productName,
        price: item.price,
        quantity: item.quantity
      })),

      totalAmount

    });


    await newOrder.save();


    // clear cart
    await Cart.deleteMany({
      userId: req.user.id
    });


    res.status(201).json({

      message: "Order placed successfully",
      order: newOrder

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
GET USER ORDERS
GET /api/order
========================================
*/

router.get("/", authMiddleware, async (req, res) => {

  try {

    const orders = await Order.find({
      userId: req.user.id
    });

    res.json(orders);

  }
  catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});


module.exports = router;
