import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;