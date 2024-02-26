"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_1 = __importDefault(require("../auth/auth"));
const createWish_1 = __importDefault(require("../controllers/createWish"));
const updateWish_1 = __importDefault(require("../controllers/updateWish"));
const deleteWish_1 = __importDefault(require("../controllers/deleteWish"));
router.post('/newWish', auth_1.default, createWish_1.default);
router.put('/updateWish', auth_1.default, updateWish_1.default);
router.delete('/deleteWish', auth_1.default, deleteWish_1.default);
exports.default = router;
