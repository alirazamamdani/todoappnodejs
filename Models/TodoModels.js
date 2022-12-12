const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  taskname: {
    type: String,
  },
  taskdescription: {
    type: String,
  },
  taskDate: {
    type: Date,
    default: Date.now(),
  },
  taskStatus: {
    type: Boolean,
  },
  taskId: {
    type: Number
  }
});

module.exports = mongoose.model("Todo", todoSchema)
