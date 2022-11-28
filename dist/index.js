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
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
const firestoreAdmin_1 = __importDefault(require("./config/firestoreAdmin"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use((0, body_parser_1.default)());
app.use((0, cors_1.default)());
app.post("/capture", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    let id = (0, uuid_1.v4)();
    const linkRef = firestoreAdmin_1.default.collection("link-image").doc(id);
    yield linkRef.set(Object.assign({ id }, data));
    const browser = yield chrome_aws_lambda_1.default.puppeteer.launch({
        args: [...chrome_aws_lambda_1.default.args, "--hide-scrollbars", "--disable-web-security"],
        executablePath: yield chrome_aws_lambda_1.default.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    });
    const page = yield browser.newPage();
    yield page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 });
    yield page.goto(`${process.env.FRONTEND_URL}/gen-table?id=${id}`);
    yield page.waitForSelector("#__next > div.overflow-x-auto > div > div");
    const element = yield page.$("#__next > div.overflow-x-auto > div > div");
    const file = yield (element === null || element === void 0 ? void 0 : element.screenshot({ type: "png" }));
    yield browser.close();
    res.setHeader("Content-Type", `image/png`);
    res.statusCode = 200;
    return res.end(file);
}));
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
