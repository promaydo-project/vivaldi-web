const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  lahir: {
    type: Date,
  },
});

module.exports = mongoose.model("Officer", officerSchema);
