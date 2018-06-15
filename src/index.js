import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.css';

let config = {
    apiKey: "AIzaSyANloVnE5gsASNUIx2J_p4Xe1Lid7O7MYs",
    authDomain: "info343p4-kwokwilliam.firebaseapp.com",
    databaseURL: "https://info343p4-kwokwilliam.firebaseio.com",
    projectId: "info343p4-kwokwilliam",
    storageBucket: "",
    messagingSenderId: "1056057145377"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
