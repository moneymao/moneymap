import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    currentAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({
  user: 1,
  deadline: 1,
});

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;