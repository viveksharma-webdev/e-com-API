const fbAdmin =require('firebase-admin');
const serviceCredentials = require('../firebase.json');

fbAdmin.initializeApp({
    credential:fbAdmin.credential.cert(serviceCredentials),
    storageBucket:"e-com.appspot.com"
})

module.exports = fbAdmin;


// this code just initializes the Firebase in our application