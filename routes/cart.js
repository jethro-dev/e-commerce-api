const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const cart = await Cart.find();
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//CREATE CART
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    return res.status(201).json(savedCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE CART
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE CART
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted.");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
