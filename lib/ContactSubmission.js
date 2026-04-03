import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContactSubmission = mongoose.models.ContactSubmission || mongoose.model('ContactSubmission', contactSubmissionSchema);
export { ContactSubmission };
