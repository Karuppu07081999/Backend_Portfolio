const express = require('express')
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const CmsAdmin = require('./admin_schema/cms')
const userRegister = require('./user_schema/register')
const FaqAdmin = require('./admin_schema/faq')

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: 'dnrrhwpap',
  api_key: '169332391287372',
  api_secret: 'hxYCtU8lL8ckOO3lklkPKXbjqnI',
});

const storage = multer.memoryStorage(); // Store images in memory before uploading to Cloudinary
const upload = multer({ storage: storage });


// Register API
router.post('/register', async (req, res) => {
  // S - Variables
 const {  firstName, lastName, userName, email, password, confirmPassword } = req.body;

 try {
   // Check if the email already exists in the database
   const existingRegister = await userRegister.findOne({ email: email });

   if (existingRegister) {
     // If email exists, return an error message
     return res.status(400).json({ error: 'Email already exists' ,  status : false});
   }
   
   const otpGenerator = Math.floor(1000 + Math.random() * 9000);
   // If email does not exist, create a new student and save it to the database
   const newRegister = new userRegister({
    firstName, lastName, userName, email, password, confirmPassword, registerOtp : otpGenerator,
   });

   await newRegister.save();
   res.json({
     data : newRegister,
     message : "Registered Data Successfully",
     status: true 
   });
 } catch (error) {
   console.error('Error:', error);
   res.status(500).json({ 
    error: 'Internal Server Error',
    status : false
  });
 }
});


// Register OTP API 

router.post('/registerOTPVerify', async (req, res) => {
  const {   email, registerOtp  } = req.body;
  try {

       
    if (!( email && registerOtp )) {
      return res.status(400).json({
        message : "All input is required !",
         status : false 
      });
    }

    const singleRegisterRecord = await userRegister.findOne({email : email});

    console.log(singleRegisterRecord,"singleCmsRecord")

    if (singleRegisterRecord) {
      if(singleRegisterRecord.registerOtp === registerOtp){
        res.json({
          data :singleRegisterRecord,
          status : true,
          message : "OTP has been Verified Successfully !",
        });
      }
      else{
        res.status(404).json({ error: 'Invalid OTP !', status : false });
      }
    } else {
      res.status(404).json({ error: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', status : false });
  }
});


// Login API 

router.post('/login', async (req, res) => {
  const {   email, password  } = req.body;
  try {
       
    if (!( email && password )) {
      return res.status(400).json({
        message : "All input is required !",
         status : false 
      });
    }

    const singleLoginRecord = await userRegister.findOne({email : email});

    if (singleLoginRecord) {

      if(singleLoginRecord.password === password && singleLoginRecord.email === email ){
        const otpGenerator = Math.floor(1000 + Math.random() * 9000);

        // Update Login details
        singleLoginRecord.loginOtp = otpGenerator;
        
        // Save the updated Login
        await singleLoginRecord.save();
          
            res.json({
              data :singleLoginRecord,
              status : true,
              message : "Login Successfully !",
            });
          
      }
      else{
        res.status(404).json({ error: 'Invalid Login Credientials !', status : false });
      }
      
    } else {
      res.status(404).json({ error: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', status : false });
  }
});


// Login OTP API 

router.post('/loginOTPVerify', async (req, res) => {
  const {   email, loginOtp  } = req.body;
  try {

       
    if (!( email && loginOtp )) {
      return res.status(400).json({
        message : "All input is required !",
         status : false 
      });
    }

    const singleLoginRecord = await userRegister.findOne({email : email});

    console.log(singleLoginRecord,"singleCmsRecord")

    if (singleLoginRecord) {
      if(singleLoginRecord.loginOtp === loginOtp){
        res.json({
          data :singleLoginRecord,
          status : true,
          message : "OTP has been Verified Successfully !",
        });
      }
      else{
        res.status(404).json({ error: 'Invalid OTP !', status : false });
      }
    } else {
      res.status(404).json({ error: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', status : false });
  }
});



// forgotPassword API 

router.post('/forgotPassword', async (req, res) => {
  const {   email  } = req.body;
  try {
       
    if (!( email )) {
      return res.status(400).json({
        message : "All input is required !",
         status : false 
      });
    }

    const singleForgotPassword = await userRegister.findOne({email : email});

    if (singleForgotPassword) {
      
        const otpGenerator = Math.floor(1000 + Math.random() * 9000);

        // Update Login details
        singleForgotPassword.forgotPasswordOtp = otpGenerator;
        
        // Save the updated Login
        await singleForgotPassword.save();
          
            res.json({
              data :singleForgotPassword,
              status : true,
              message : "Register Email to Sent OTP Successfully, Please Verify !",
            });
     
    } else {
      res.status(404).json({ error: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', status : false });
  }
});


//ForgotPassword OTP API 

router.post('/forgotPasswordOTPVerify', async (req, res) => {
  const {   email, forgotPasswordOtp  } = req.body;
  try {

    if (!( email && forgotPasswordOtp )) {
      return res.status(400).json({
        message : "All input is required !",
         status : false 
      });
    }

    const singleForgotPassword = await userRegister.findOne({email : email});

    console.log(singleForgotPassword,"singleCmsRecord")

    if (singleForgotPassword) {
      if(singleForgotPassword.forgotPasswordOtp === forgotPasswordOtp){
        res.json({
          data :singleForgotPassword,
          status : true,
          message : "OTP has been Verified Successfully !",
        });
      }
      else{
        res.status(404).json({ error: 'Invalid OTP !', status : false });
      }
    } else {
      res.status(404).json({ error: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', status : false });
  }
});



//Reset Password OTP API 

router.post('/resetPassword', async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {

    if (!( password && confirmPassword )) {
      return res.status(400).json({
        message : "All input is required !",
         status : false 
      });
    }

    const singleResetPassword = await userRegister.findOne({email : email});

    console.log(singleResetPassword,"singleCmsRecord")

    if (singleResetPassword) {
      
        // Update Login Password Updated details
        singleResetPassword.password = password;
        singleResetPassword.confirmPassword = confirmPassword;
        
        // Save the updated Login
        await singleResetPassword.save();
        res.json({
          data :singleResetPassword,
          status : true,
          message : "Reset Password Successfully !",
        });
     
    } else {
      res.status(404).json({ error: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', status : false });
  }
});


// About Us, Privacy and Terms 

router.get('/getsinglecms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleCmsRecord = await CmsAdmin.findById(id);

    if (singleCmsRecord) {
      res.status(200).json({
        data :singleCmsRecord,
        status : true,
      });
    } else {
      res.status(404).json({ error: 'Rocord not found !!!' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// About Us, Privacy and Terms 

router.get('/getfaq', async (req, res) => {

  try {
    const singleFaqRecord = await FaqAdmin.find();

    if (singleFaqRecord) {
      res.status(200).json({
        data :singleFaqRecord,
        status : true,
      });
    } else {
      res.status(404).json({ error: 'Rocord not found !!!' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// // Endpoint for image upload
// webapp.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     // Upload image to Cloudinary
//     const uploadStream = cloudinary.uploader.upload_stream({ folder: 'uploads' }, async (error, result) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Error uploading to Cloudinary' });
//       }
//       res.json({ message: 'Image uploaded successfully', data: result.secure_url });
//     });
    
//     const bufferStream = new Readable();
//     bufferStream.push(req.file.buffer);
//     bufferStream.push(null);
//     bufferStream.pipe(uploadStream);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// Endpoint for KYC image upload
router.post('/kyc-upload', upload.fields([
  { name: 'kycFrontImage', maxCount: 1 },
  { name: 'kycBackImage', maxCount: 1 },
  { name: 'kycSelfiImage', maxCount: 1 }
]), async (req, res) => {
  const {  id, kycProof, kycProofNumber } = req.body;
  try {
    const uploadPromises = [];
    const singlekycUpload = await userRegister.findById(id);
    
    uploadPromises.push(uploadToCloudinary(req.files['kycFrontImage'][0].buffer, 'kycFrontImage'));
    uploadPromises.push(uploadToCloudinary(req.files['kycBackImage'][0].buffer, 'kycBackImage'));
    uploadPromises.push(uploadToCloudinary(req.files['kycSelfiImage'][0].buffer, 'kycSelfiImage'));

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    
    singlekycUpload.kycFrontImage = results[0].secure_url;
    singlekycUpload.kycBackImage = results[1].secure_url;
    singlekycUpload.kycSelfiImage = results[2].secure_url;
    singlekycUpload.kycProof = kycProof;
    singlekycUpload.kycProofNumber = kycProofNumber;
    
       // Save the updated Login
    await singlekycUpload.save();

    res.json({ message: 'KYC Images uploaded successfully',
    kycFrontImage : results[0].secure_url,
    kycBackImage : results[1].secure_url,
    selfieImage : results[2].secure_url,
     status : true, });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to upload image to Cloudinary
function uploadToCloudinary(buffer, type) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'kyc-uploads', resource_type: 'image', tags: [type] },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Pipe the file buffer to the Cloudinary upload stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
}



// Endpoint for KYC image upload
router.post('/kyc-user-status', async (req, res) => {
  const {  id } = req.body;
  try {
    
    const singlekycUpload = await userRegister.findById(id);

    let kycImages =  [{
      kycFrontImage : singlekycUpload.kycFrontImage,
      kycBackImage : singlekycUpload.kycBackImage,
      kycSelfiImage : singlekycUpload.kycSelfiImage,
      kycProof : singlekycUpload.kycProof,
      kycProofNumber: singlekycUpload.kycProofNumber,
    }]

    if(singlekycUpload){
      res.json({ message: 'KYC Images uploaded successfully',
      kycData : kycImages,
       status : true, });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router
