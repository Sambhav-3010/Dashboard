const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true},
    phoneNumber: { type: String, required: false, trim: true },
    needsPhoneNumberCompletion: { type: Boolean, default: false },
    wishlist: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
        whatsappNumber: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const user = mongoose.model('User', UserSchema);
module.exports = user;
