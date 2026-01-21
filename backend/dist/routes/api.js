"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Customer_1 = require("../models/Customer");
const Transaction_1 = require("../models/Transaction");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(authMiddleware_1.authMiddleware);
// CUSTOMER ROUTES
router.get('/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customers = yield Customer_1.Customer.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
}));
router.post('/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customer = new Customer_1.Customer(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
        yield customer.save();
        res.status(201).json(customer);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create customer' });
    }
}));
// TRANSACTION ROUTES
router.get('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transactions = yield Transaction_1.Transaction.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.json(transactions);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
}));
router.post('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transaction = new Transaction_1.Transaction(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
        yield transaction.save();
        res.status(201).json(transaction);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create transaction' });
    }
}));
router.put('/transactions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transaction = yield Transaction_1.Transaction.findOne({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!transaction)
            return res.status(404).json({ error: 'Transaction not found' });
        Object.assign(transaction, req.body);
        yield transaction.save();
        res.json(transaction);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update transaction' });
    }
}));
router.delete('/transactions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transaction = yield Transaction_1.Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!transaction)
            return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
}));
exports.default = router;
