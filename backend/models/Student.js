const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let studentSchema = new Schema({
  phone: {
    type: String,
    unique: true,
  },
  day: {
    type: Date
  },
  plan: {
    type: String
  },
  status: {
    type: Number,
    default: 0
  },
  vence: {
    type: Date
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
  },
  mail:{
    type: String,
    default: ''
  },
  pass:{
    type: String,
    default: ''
  },
  perfilNet:{
    type: String,
    default: ''
  },
  notes:{
    type: String,
    default: ''
  },
  send:{
    type: String,
    default: '1'
  }
}, {
    collection: 'clients'
  })

module.exports = mongoose.model('Clients', studentSchema)