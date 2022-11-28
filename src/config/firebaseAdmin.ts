import admin from "firebase-admin";
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN as string);
const config = {
    credential: admin.credential.cert(serviceAccount),
};
let firebaseAdmin: admin.app.App;

if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp(config);
} else {
    firebaseAdmin = admin.app();
}

export default firebaseAdmin;