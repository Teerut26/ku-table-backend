"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
const firebaseAdmin_1 = __importDefault(require("./firebaseAdmin"));
const db = (0, firestore_1.getFirestore)(firebaseAdmin_1.default);
exports.default = db;
