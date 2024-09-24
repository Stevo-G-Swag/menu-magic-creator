import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  solution: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

problemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;