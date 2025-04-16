import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCzvlyU00aijqimwZzZOq8vJLABaQihglo",
  authDomain: "weather-app-96fd4.firebaseapp.com",
  projectId: "weather-app-96fd4",
  storageBucket: "weather-app-96fd4.firebasestorage.app",
  messagingSenderId: "265788398326",
  appId: "1:265788398326:web:5ed8447dde9fdb9ea7aad7",
  measurementId: "G-GSSN8Q42CS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };
