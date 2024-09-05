import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  openaiApiKey: { type: String },
  githubClientId: { type: String },
  githubClientSecret: { type: String },
  litellmApiKey: { type: String },
  openrouterApiKey: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

settingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;