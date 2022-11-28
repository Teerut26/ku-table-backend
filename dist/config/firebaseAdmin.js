"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN);
const config = {
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
};
let firebaseAdmin;
if (!firebase_admin_1.default.apps.length) {
    firebaseAdmin = firebase_admin_1.default.initializeApp(config);
}
else {
    firebaseAdmin = firebase_admin_1.default.app();
}
exports.default = firebaseAdmin;
