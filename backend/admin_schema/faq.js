const mongoose = require('mongoose');
const faqschema = new mongoose.Schema({
    faqSection: {
        type: String,
        required: true,
    },
    faqQuestion: {
        type: String,
        required: true,
    },
    faqAnswer: {
        type: String,
        required: true,
    },
    createdAt  : { 
        type : Date, 
        default: Date.now 
    }
});
const faqAdmin = new mongoose.model('Faq', faqschema);
module.exports = faqAdmin;