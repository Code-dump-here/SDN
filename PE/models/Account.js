const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
  un: { type: String, required: true },
  pw: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Account', AccountSchema);
