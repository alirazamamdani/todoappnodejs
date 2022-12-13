const moongoose = require("mongoose");

const userShcema = moongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const userAuthSchema = moongoose.model("User", userShcema);

module.exports = userAuthSchema;
