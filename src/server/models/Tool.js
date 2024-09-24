import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

toolSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Tool = mongoose.model('Tool', toolSchema);

export default Tool;