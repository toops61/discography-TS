"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_1 = __importDefault(require("../auth/auth"));
const createDisc_1 = __importDefault(require("../controllers/createDisc"));
const updateDisc_1 = __importDefault(require("../controllers/updateDisc"));
const deleteDisc_1 = __importDefault(require("../controllers/deleteDisc"));
router.post('/newDisc', auth_1.default, createDisc_1.default);
router.put('/updateDisc', auth_1.default, updateDisc_1.default);
router.delete('/deleteDisc', auth_1.default, deleteDisc_1.default);
exports.default = router;
