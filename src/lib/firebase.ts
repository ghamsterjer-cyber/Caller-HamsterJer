import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD1TafaoL4HwEo5FKz7m4_6XOeJ3X5kGxg",
    authDomain: "webrtc-phone-app.web.app",
    databaseURL: "https://webrtc-phone-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webrtc-phone-app",
    storageBucket: "webrtc-phone-app.appspot.com",
    messagingSenderId: "505124007738",
    appId: "1:505124007738:web:763b4a1b3cf2b7c830aa03",
};


let app: FirebaseApp;
let database: Database;

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
} catch (error) {
    console.error("Firebase initialization error", error);
}

export { database };
