const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const loanSchema = new mongoose.Schema({
  dateLoan: {
    type: Date,
  },
  dateReturn: {
    type: Date,
  },
  terlambat: {
    type: String,
  },
  denda: {
    type: String,
  },
  kelasId: {
    type: ObjectId,
    ref: "Members",
  },
  booksId: {
    type: ObjectId,
    ref: "Books",
  },
  memberId: {
    type: ObjectId,
    ref: "Members",
  },
  officerId: {
    type: ObjectId,
    ref: "Officer",
  },
});

module.exports = mongoose.model("LoanBook", loanSchema);
