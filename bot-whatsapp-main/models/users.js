const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let studentSchema = new Schema({
  phone: {
    type: String,
    unique: true,
  },
  day: {
    type: String
  },
  plan: {
    type: String
  },
  status: {
    type: Number,
    default: 0
  },
  vence: {
    type: String
  },
  numberVence: {
    type: String
  },
  saldo: {
    type: Number
  },
  typeAcount:{
    type: String,
    default: ''
  },
  pinNetflix:{
    type: String,
    default: ''
  }
}, {
    collection: 'clients'
  })

module.exports = mongoose.model('Clients', studentSchema)