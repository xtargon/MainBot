const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let servicesSchema = new Schema({
  typeService: {
    type: String
  },
  price: {
    type: String
  },
  details: {
    type: String
  }
},{
    collection: 'services'
})

module.exports = mongoose.model('Services', servicesSchema)