let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let expenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  category: { type: [String], required: true },
  amount: Number,
  data: Date,
}, { timestamps: true });


let Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;