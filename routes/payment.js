const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/", async (req, res) => {
  const { products } = req.body;

  const calculateOrderAmount = () => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    const priceArr = products.map(
      (product) => product.price * product.quantity
    );

    const total = priceArr.reduce((a, b) => a + b) * 100;
    return Math.round(total * 100) / 100;
  };

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: "gbp",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
module.exports = router;
