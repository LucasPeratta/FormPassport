// definimos esquema

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
});

userSchema.methods.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", userSchema);
