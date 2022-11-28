import bodyParser from "body-parser";
import express from "express";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer"
import db from "./config/firestoreAdmin";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
require("dotenv").config();

const app = express();

app.use(bodyParser());
app.use(cors());

app.post("/capture", async (req, res) => {
    let data: any = req.body;

    let id = uuidv4();
    const linkRef = db.collection("link-image").doc(id);
    await linkRef.set({
        id,
        ...data,
    });

    const browser = await chromium.puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 });
    await page.goto(`${process.env.FRONTEND_URL}/gen-table?id=${id}`);

    await page.waitForSelector(
        "#__next > div.overflow-x-auto > div > div"
    );
    const element = await page.$(
        "#__next > div.overflow-x-auto > div > div"
    );
    const file = await element?.screenshot({ type: "png" });
    await browser.close();

    res.setHeader("Content-Type", `image/png`);
    res.statusCode = 200;
    return res.end(file);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
