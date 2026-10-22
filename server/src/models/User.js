const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  profileImageUrl: { type: String, default: "https://placehold.co/96x96?text=User" },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER", index: true },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true, versionKey: false });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toSafeJSON = function() {
  return {
    id: this._id.toString(), username: this.username, email: this.email,
    profileImageUrl: this.profileImageUrl, role: this.role
  };
};

module.exports = mongoose.model("User", userSchema);
