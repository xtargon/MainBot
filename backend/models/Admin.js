const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let adminSchema = new Schema({
  name: {
    type: String
  },
  pass: {
    type: String
  },

}, {
    collection: 'admin'
  })

module.exports = mongoose.model('Admin', adminSchema)