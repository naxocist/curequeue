import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAp8cxB8EE02CYqf0d9KemDlVnUwRgx6No",
    authDomain: "login-form-596e1.firebaseapp.com",
    projectId: "login-form-596e1",
    storageBucket: "login-form-596e1.appspot.com",
    messagingSenderId: "911793008022",
    appId: "1:911793008022:web:9ffd9fae871a2468f001b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;
                    if (userData.profilePic) {
                        document.getElementById('profilePic').src = userData.profilePic;
                    }
                } else {
                    console.log("no document found matching id");
                }
            })
            .catch((error) => {
                console.log("Error getting document");
            });
    } else {
        console.log("User Id not Found in Local storage");
    }
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        const storageRef = ref(storage, `profilePictures/${loggedInUserId}`);
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                return getDownloadURL(snapshot.ref);
            })
            .then((downloadURL) => {
                const docRef = doc(db, "users", loggedInUserId);
                return updateDoc(docRef, { profilePic: downloadURL });
            })
            .then(() => {
                document.getElementById('profilePic').src = URL.createObjectURL(file);
            })
            .catch((error) => {
                console.error("Error uploading file: ", error);
            });
    }
});

const exitButton = document.getElementById('logout');
exitButton.addEventListener('click', () => {
    window.location.href = 'homepage.html';
});
