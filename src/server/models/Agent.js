import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

agentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;