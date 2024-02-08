const mongoose = require('mongoose');
const registerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default : ''
    },
    lastName: {
        type: String,
        default : ''
    },
    userName:{
        type: String,
        default : ''
    },
    email:{
        type: String,
        default : ''
    },
    password:{
        type: String,
        default : ''
    },
    confirmPassword:{
        type: String,
        default : ''
    },
    registerOtp:{
        type: Number,
        default : ''
    },
    loginOtp:{
        type: Number,
        default : ''
    },
    forgotPasswordOtp:{
        type: Number,
        default : ''
    },
    kycProof:{
        type: String,
        default : ''
    },
    kycProofNumber:{
        type: String,
        default : ''
    },
    kycFrontImageStatus:{
        type: Number,
        default : 0
    },
    kycFrontImage:{
        type: String,
        default : ''
    },
    kycBackImageStatus:{
        type: Number,
        default : 0
    },
    kycBackImage:{
        type: String,
        default : ''
    },
    kycSelfiImageStatus:{
        type: Number,
        default : 0
    },
    kycSelfiImage:{
        type: String,
        default : ''
    },
    modifyAt : { 
        type : Date, 
        default: Date.now 
    }
},{timestamps:true});
const userRegister = new mongoose.model('register', registerSchema);
module.exports = userRegister;