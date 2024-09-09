import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  openaiApiKey: { type: String },
  githubToken: { type: String },
  huggingfaceApiKey: { type: String },
  litellmApiKey: { type: String },
  openrouterApiKey: { type: String },
  defaultProvider: { type: String, default: 'openai' },
  defaultModel: { type: String, default: 'gpt-3.5-turbo' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

settingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;