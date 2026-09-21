import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  contact: Number,
  address: String,
  gender: String,
});

userSchema.methods.getDetails = function getDetails() {
  const details =
    this.name && this.age && this.contact
      ? `User name is ${this.name} and age is ${this.age}. For personal contact, call ${this.contact}`
      : false;

  return details;
};

const User = mongoose.model("User", userSchema);

export default User;
