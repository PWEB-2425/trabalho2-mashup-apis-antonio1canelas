const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  searches: [String]  // Histórico de pesquisas
});

module.exports = mongoose.model('User', UserSchema);
