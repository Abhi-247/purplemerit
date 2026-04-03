import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Since we are in a serverless environment, avoid redefining the model on hot reloads/repeated invocations
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
