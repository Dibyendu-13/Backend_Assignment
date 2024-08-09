const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Bills = mongoose.model('Bills', billSchema);

module.exports = Bills;
