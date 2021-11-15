const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const connectDB = async (uri) => {
  await mongoose.connect(uri);
  console.log("DB connected successfully.");
};

app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", orderRoute);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await app.listen(process.env.PORT, () =>
      console.log(`Server is listening on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

startServer();
