import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerId: { type: String, required: true },
    type: { type: String, enum: ['purchase', 'payment'], required: true },
    amount: { type: Number, required: true },
    items: [purchaseItemSchema],
    description: String,
    date: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
