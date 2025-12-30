// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWMEQ2-3gj3cAqRpB4uWADdEHn7lX0aQ0",
  authDomain: "college-life-game.firebaseapp.com",
  databaseURL: "https://college-life-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "college-life-game",
  storageBucket: "college-life-game.firebasestorage.app",
  messagingSenderId: "238065503588",
  appId: "1:238065503588:web:05a235911ac599c06cbe71"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

console.log('Firebase initialized successfully!');
