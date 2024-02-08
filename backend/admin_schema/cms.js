const mongoose = require('mongoose');
const cmsschema = new mongoose.Schema({
    cmstitle: {
        type: String,
        required: true,
    },
    cmsContent: {
        type: String,
        required: true,
    },
    createdAt  : { 
        type : Date, 
        default: Date.now 
    }
 

});
const cmsAdmin = new mongoose.model('Cms', cmsschema);
module.exports = cmsAdmin;