const mongoose = require('mongoose');
const registerSchema = new mongoose.Schema({
   
    email:{
        type: String,
        default : ''
    },
    password:{
        type: String,
        default : ''
    },
    pattern:{
        type: Number,
        default : ''
    },
    confirmPassword:{
        type: String,
        default : ''
    },
    forgotPasswordOtp:{
        type: Number,
        default : ''
    },
    forgotPatternOtp:{
        type: Number,
        default : ''
    }

},{timestamps:true});
const adminRegister = new mongoose.model('adminRegister', registerSchema);
module.exports = adminRegister;