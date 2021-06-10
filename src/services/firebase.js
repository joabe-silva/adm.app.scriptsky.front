import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAm2bVsqK6x0gDpwHTxmgdANZDZETZ0Af8",
    authDomain: "app-scriptsky-com-br.firebaseapp.com",
    projectId: "app-scriptsky-com-br",
    storageBucket: "app-scriptsky-com-br.appspot.com",
    messagingSenderId: "705535354037",
    appId: "1:705535354037:web:92809371d2758dd19a4afc",
    measurementId: "G-YJ5WW04WP4"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();

export default storage;