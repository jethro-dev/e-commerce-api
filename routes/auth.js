const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
      password: CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_PASSPHRASE
      ).toString(),
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //find user from db
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Wrong username or password.");
    }

    //decrypt pw from db
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_PASSPHRASE
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword === req.body.password) {
      const { password, ...others } = user._doc;

      const accessToken = jwt.sign(
        {
          id: user._id,
          admin: user.admin,
        },
        process.env.JWT_SECRET
      );

      return res.status(200).json({ ...others, accessToken });
    } else {
      return res.status(400).json("Wrong username or password.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
