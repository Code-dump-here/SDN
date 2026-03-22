const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Account = require('../models/Account');

router.get('/signin', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

router.post('/signin', async (req, res) => {
  try {
    const { un, pw } = req.body;
    const account = await Account.findOne({ un });
    if (!account || !(await bcrypt.compare(pw, account.pw))) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/auth/signin');
    }
    req.session.user = { id: account._id, un: account.un };
    res.redirect('/view/residents');
  } catch {
    req.flash('error', 'Something went wrong');
    res.redirect('/auth/signin');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/signin'));
});

module.exports = router;
