import mongoose from 'mongoose';

const SearchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

SearchHistorySchema.index({ user: 1, searchedAt: -1 });

const SearchHistory =
  mongoose.models.SearchHistory || mongoose.model('SearchHistory', SearchHistorySchema);

export default SearchHistory;
