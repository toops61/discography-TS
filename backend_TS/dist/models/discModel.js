"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const discSchema = new mongoose_1.Schema({
    artist: { type: String, required: true },
    album: { type: String, required: true },
    year: { type: Number, required: false },
    genre: { type: String, required: true },
    format: { type: String, required: true },
    cover: { type: String, required: false },
    digipack: { type: Boolean, required: true }
});
const DiscModel = (0, mongoose_1.model)('Disc', discSchema);
exports.default = DiscModel;
