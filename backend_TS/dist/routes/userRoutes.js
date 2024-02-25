"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const subscribe_1 = __importDefault(require("../controllers/subscribe"));
const login_1 = __importDefault(require("../controllers/login"));
router.post('/subscribe', subscribe_1.default);
router.post('/login', login_1.default);
exports.default = router;
