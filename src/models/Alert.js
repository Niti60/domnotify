import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Domain',
      default: null,
    },
    type: {
      type: String,
      enum: ['ssl_expiring', 'domain_expiring', 'nameserver_changed', 'domain_available'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

AlertSchema.index({ user: 1, createdAt: -1 });
AlertSchema.index({ user: 1, read: 1 });

const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);

export default Alert;
