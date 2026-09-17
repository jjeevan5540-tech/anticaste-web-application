const firebaseConfig = {
  apiKey: "AIzaSyC9pSlA6hQ04QTfdvLz3NR1rkHEHBXTn5k",
  authDomain: "anticaste-webapp.firebaseapp.com",
  databaseURL: "https://anticaste-webapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anticaste-webapp",
  storageBucket: "anticaste-webapp.firebasestorage.app",
  messagingSenderId: "1085863264061",
  appId: "1:1085863264061:web:a5b825e2f6048732e78f54",
  measurementId: "G-QC7RQS38DW"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
