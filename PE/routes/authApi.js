const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

router.post('/login', async (req, res, next) => {
  try {
    const { un, pw } = req.body;
    const account = await Account.findOne({ un });
    if (!account) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(pw, account.pw);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: account._id, un: account.un }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
