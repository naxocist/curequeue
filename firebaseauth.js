import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAp8cxB8EE02CYqf0d9KemDlVnUwRgx6No",
    authDomain: "login-form-596e1.firebaseapp.com",
    projectId: "login-form-596e1",
    storageBucket: "login-form-596e1.appspot.com",
    messagingSenderId: "911793008022",
    appId: "1:911793008022:web:9ffd9fae871a2468f001b7"
};

const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        });
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();
    const db = getFirestore();

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);

             // Fetch user role from Firestore
             const docRef = doc(db, "users", user.uid);
             const docSnap = await getDoc(docRef);
             if (docSnap.exists()) {
                 const userData = docSnap.data();
                 const userRole = userData.role;
 
                 // Redirect based on user role
                 if (userRole === 'Doctor') {
                     window.location.href = 'homedoc.html';
                 } else {
                     window.location.href = 'homepage.html'; // Default page if role doesn't match
                 }
             } else {
                 showMessage('No such user found!', 'signInMessage');
             }
         })
         .catch((error) => {
             const errorCode = error.code;
             if (errorCode === 'auth/invalid-credential') {
                 showMessage('Incorrect Email or Password', 'signInMessage');
             } else {
                 showMessage('Account does not Exist', 'signInMessage');
             }
         });
 });