"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const wishSchema = new mongoose_1.Schema({
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
    cover: { type: String, required: false }
});
const WishModel = (0, mongoose_1.model)('Wish', wishSchema);
exports.default = WishModel;
