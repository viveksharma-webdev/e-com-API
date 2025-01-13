const express = require('express');
const multer = require('multer');
const fbAdmin = require('./firebaseConfig.js');
const serviceCredentials = require('../firebase.json');
const firebaseStorage = require('multer-firebase-storage');
const app = new express();

const storage = firebaseStorage({
    bucketName: 'e-com.appspot.com',
    credentials: fbAdmin.credential.cert(serviceCredentials),
    unique:true,
    public:true,
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});


module.exports = upload;