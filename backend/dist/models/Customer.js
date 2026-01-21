"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: String,
    createdAt: { type: Date, default: Date.now }
});
exports.Customer = mongoose_1.default.model('Customer', customerSchema);
