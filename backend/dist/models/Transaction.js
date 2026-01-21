"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const purchaseItemSchema = new mongoose_1.default.Schema({
    id: String,
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
}, { _id: false });
const transactionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerId: { type: String, required: true },
    type: { type: String, enum: ['purchase', 'payment'], required: true },
    amount: { type: Number, required: true },
    items: [purchaseItemSchema],
    description: String,
    date: { type: Date, default: Date.now }
});
exports.Transaction = mongoose_1.default.model('Transaction', transactionSchema);
