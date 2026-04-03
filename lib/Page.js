import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Welcome' },
    subtitle: { type: String, default: 'Your subtitle here' },
    buttonText: { type: String, default: 'Get Started' },
    buttonLink: { type: String, default: '#' },
  },
  features: [{
    title: { type: String },
    description: { type: String },
  }],
  gallery: [{ type: String }],
  contact: {
    email: { type: String, default: '' },
  },
}, { _id: false });

const pageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, default: 'Untitled Page' },
  slug: { type: String, unique: true, sparse: true },
  theme: { type: String, enum: ['minimal', 'dark', 'pastel', 'neobrutal', 'luxury', 'retro'], default: 'minimal' },
  isPublished: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  content: { type: contentSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Page = mongoose.models.Page || mongoose.model('Page', pageSchema);
export { Page };
