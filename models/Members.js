const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  nisn: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  kelas: {
    type: String,
    required: true,
  },
  tahun: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Members", memberSchema);
