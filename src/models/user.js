import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 64,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      maxlength: 150,
      default: '',
    },
    articlesAmount: {
      type: Number,
      default: 0,
    },
    savedStories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export const User = mongoose.model('User', userSchema);
