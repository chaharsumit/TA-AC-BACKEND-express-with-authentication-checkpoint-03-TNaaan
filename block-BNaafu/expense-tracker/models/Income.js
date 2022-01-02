let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let incomeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  source: { type: [String], required: true },
  amount: Number,
  date: Date,
}, { timestamps: true });


let Income = mongoose.model('Income', incomeSchema);

module.exports = Income;