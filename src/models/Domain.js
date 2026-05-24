import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    domainName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    registrar: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    renewalPrice: {
      type: Number,
      default: 0,
    },
    sslIssuer: {
      type: String,
      default: null,
    },
    sslValidFrom: {
      type: Date,
      default: null,
    },
    sslValidTo: {
      type: Date,
      default: null,
    },
    sslStatus: {
      type: String,
      enum: ['Valid', 'Renew soon', 'Expired', 'Unknown'],
      default: 'Unknown',
    },
    sslSerialNumber: {
      type: String,
      default: null,
    },
    sslEncryption: {
      type: String,
      default: null,
    },
    sslChainStatus: {
      type: String,
      default: null,
    },
    nameservers: {
      type: [String],
      default: [],
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    watchlist: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Expiring Soon', 'Expired', 'Review', 'Pending'],
      default: 'Available',
    },
    lastChecked: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

DomainSchema.index({ user: 1, domainName: 1 }, { unique: true });
DomainSchema.index({ user: 1, expiryDate: 1 });
DomainSchema.index({ user: 1, sslValidTo: 1 });

const Domain = mongoose.models.Domain || mongoose.model('Domain', DomainSchema);

export default Domain;
