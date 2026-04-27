const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const personalInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
  },
  bio: {
    type: String,
    default: "",
    maxlength: [500, "Bio cannot exceed 500 characters"],
  },
  profile_img: {
    type: String,
    default: "",
  },
});

const socialLinksSchema = new mongoose.Schema({
  youtube: { type: String, default: "" },
  facebook: { type: String, default: "" },
  twitter: { type: String, default: "" },
  github: { type: String, default: "" },
  instagram: { type: String, default: "" },
  website: { type: String, default: "" },
});

const accountInfoSchema = new mongoose.Schema({
  total_posts: {
    type: Number,
    default: 0,
  },
  total_reads: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema(
  {
    personal_info: {
      type: personalInfoSchema,
      required: true,
    },
    social_links: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    account_info: {
      type: accountInfoSchema,
      default: () => ({}),
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("personal_info.password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.personal_info.password = await bcrypt.hash(
    this.personal_info.password,
    salt,
  );
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.personal_info.password);
};

// Method to get user without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  // Remove password from response
  if (user.personal_info && user.personal_info.password) {
    delete user.personal_info.password;
  }
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
