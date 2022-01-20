const {initializeApp} = require('firebase/app');
const {getFirestore} = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAxrXrzfDY6xJ7R2dHF_7WbVXBd0qH51WQ",
    authDomain: "evoter-test1.firebaseapp.com",
    projectId: "evoter-test1",
    storageBucket: "evoter-test1.appspot.com",
    messagingSenderId: "26539303143",
    appId: "1:26539303143:web:6ae803a86aac616f7e0242",
    measurementId: "G-SX66YXC9C6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;