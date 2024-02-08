const express = require('express')
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const CmsAdmin = require('./admin_schema/cms')
const FaqAdmin = require('./admin_schema/faq')
const adminRegister = require('./admin_schema/register')


// API Testing !!!!!!!!!!!!
router.get("/",(req, res) => {
  console.log("Done")
  res.status(200).json({
   message:"Welcome 🙌"
  }); 
});

// JWT Auth Checking
router.post("/welcome", auth, (req, res) => {
  console.log("JWT Done")
  res.status(200).json("Welcome 🙌 ");
});

// OTP generate API
router.post("/generate-one-time-otp", (req, res) => {
  const otpGenerator = Math.floor(1000 + Math.random() * 9000);
  try{
    console.log(otpGenerator,"Done")
    res.status(200).json({
      email:"raj@gmail.com",
      otp : otpGenerator
    });
  }
  catch (err) {
    console.log(err);
  }
  
});

// Register
router.post("/register", async (req, res) => {
  console.log("Start Register !!!");
  try {
   
    let email = "a@gmail.com"
    const token = jwt.sign(
      { user_id: "12345", email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "60s",
      }
    );
    
    res.status(201).json({
      tokenID : token
    });
  } catch (err) {
    console.log(err);
  }
  
});


// Create a New Cms Record From Admin API 

router.post('/addingCms', async (req, res) => {
  const { cmstitle, cmsContent } = req.body ;

  try {
    // Check if the email already exists in the database
    const existingCmsTitle = await CmsAdmin.findOne({ cmstitle: cmstitle });

    if (existingCmsTitle) {
      // If email exists, return an error message
      return res.status(400).json({ message: 'CMS Title already exists !!!', status : false });
    }

    // If email does not exist, create a new Cms and save it to the database
    const newCmsRecord = new CmsAdmin({
      cmstitle,
      cmsContent,
    });

    await newCmsRecord.save();
    res.json({
      data : newCmsRecord,
      message : "Cms record created successfully !!!"
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all CMS Record API

router.get('/getallcms',async (req, res) => {
  try {
    const allCmsRecord = await CmsAdmin.find(); // Retrieve all Cms from MongoDB
    res.json({
      data : allCmsRecord,
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.post('/getsinglecms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleCmsRecord = await CmsAdmin.findById(id);

    if (singleCmsRecord) {
      res.json({
        data :singleCmsRecord
      });
    } else {
      res.status(404).json({ message: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/cmsRecordUpdate/:id', async (req, res) => {
  const { id } = req.params;
  const { cmstitle, cmsContent } = req.body ;

  try {
    // Find the Cms by ID
    const existingCmsID = await CmsAdmin.findById(id);

    console.log(existingCmsID,"existingCmsID")

    if (!existingCmsID) {
      return res.status(404).json({ message: 'Record not found',status : false });
    }

    if (!(cmstitle && cmsContent)) {
      return res.status(400).json({
        message : "All input is required !",
        status : false
      });
    }

    
    if ((cmstitle ===  existingCmsID.cmstitle && cmsContent === existingCmsID.cmsContent)) {
      return res.status(400).json({
        message : "No change record !",
        status : false
      });
    }

    // Update Cms's details
    existingCmsID.cmstitle = cmstitle;
    existingCmsID.cmsContent = cmsContent;
  

    // Save the updated Cms data
    await existingCmsID.save();

    res.json({
      message : "Cms Record has been updated successfully !!"
    });

  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/cmsDelete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleCmsRecordDelete = await CmsAdmin.findByIdAndDelete(id);
    if (singleCmsRecordDelete) {
      res.json({
         message: 'CMS Record deleted successfully' 
      });
    } else {
      res.status(404).json({ message: 'Rocord not found !!!', status : false });
    }
    
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Create a New Faq Record From Admin API 

router.post('/addingFaq', async (req, res) => {
  const { faqSection, faqQuestion, faqAnswer } = req.body ;

  try {
    
    if (!(faqSection && faqQuestion && faqAnswer )) {
      return res.status(400).json({
        message : "All input is required !"
      });
    }

    const existingfaqQuestion = await FaqAdmin.findOne({ faqQuestion: faqQuestion });


    if (existingfaqQuestion) {
      return res.status(400).json({ message: 'faq Question already exists !!!',status : false });
    }

    const newFaqRecord = new FaqAdmin({
      faqSection,
      faqQuestion,
      faqAnswer
    });

    await newFaqRecord.save();
    res.json({
      data : newFaqRecord,
      message : "FAQ record created successfully !!!"
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all FAQ Record API

router.get('/getallfaq',async (req, res) => {
  try {
    const allFAQRecord = await FaqAdmin.find(); // Retrieve all FAQ from MongoDB
    res.json({
      data : allFAQRecord,
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/getsinglefaq/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleFAQRecord = await FaqAdmin.findById(id);

    if (singleFAQRecord) {
      res.json({
        data :singleFAQRecord
      });
    } else {
      res.status(404).json({ message: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/faqRecordUpdate/:id', async (req, res) => {
  const { id } = req.params;
  const { faqSection, faqQuestion, faqAnswer } = req.body ;

  try {
    
    
    if (!(faqSection && faqQuestion && faqAnswer )) {
      return res.status(400).json({
        message : "All input is required !"
      });
    }

    const existingFAQID = await FaqAdmin.findById(id);

    if (!existingFAQID) {
      return res.status(404).json({ message: 'Record not found', status : false });
    }

    
    if ((faqSection ===  existingFAQID.faqSection && faqQuestion === existingFAQID.faqQuestion && faqAnswer === existingFAQID.faqAnswer)) {
      return res.status(400).json({
        message : "No changes record !",
        status : false
      });
    }

    // Update FAQ's details
    existingFAQID.faqSection = faqSection;
    existingFAQID.faqQuestion = faqQuestion;
    existingFAQID.faqAnswer = faqAnswer;

    // Save the updated FAQ data
    await existingFAQID.save();

    res.json({
      message : "FAQ Record has been updated successfully !!"
    });

  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/faqDelete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleFAQRecordDelete = await FaqAdmin.findByIdAndDelete(id);
    if (singleFAQRecordDelete) {
      res.json({
         message: 'CMS Record deleted successfully' 
      });
    } else {
      res.status(404).json({ message: 'Rocord not found !!!', status : false });
    }
    
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Admin Register 



// Register API
router.post('/adminregister', async (req, res) => {
  // S - Variables
 const {  email, password, pattern } = req.body;

 try {
   // Check if the email already exists in the database
   const existingRegister = await adminRegister.findOne({ email: email });

   if (existingRegister) {
     // If email exists, return an error message
     return res.status(400).json({ message: 'Email already exists' ,  status : false});
   }
   
   // If email does not exist, create a new student and save it to the database
   const newRegister = new adminRegister({
    email, password, pattern,
   });

   await newRegister.save();
   res.json({
     data : newRegister,
     message : "Registered Data Successfully",
     status: true 
   });
 } catch (error) {
   
   res.status(500).json({ 
    message: 'Internal Server Error',
    status : false
  });
 }
});


// Login API 

router.post('/login', async (req, res) => {
  const {   email, password, pattern  } = req.body;
  try {
       
    if (!( email && password && pattern )) {
      return res.status(400).json({
        message : "All input is required !",
         status : false 
      });
    }

    const singleLoginRecord = await adminRegister.findOne({email : email});

    if (singleLoginRecord) {

      if(singleLoginRecord.password === password && singleLoginRecord.email === email && singleLoginRecord.pattern === pattern ){

        // Update Login details
        // singleLoginRecord.loginOtp = otpGenerator;
        
        // // Save the updated Login
        // await singleLoginRecord.save();
          
            res.json({
              data :singleLoginRecord,
              status : true,
              message : "Login Successfully !",
            });
          
      }
      else{
        res.status(404).json({ message: 'Invalid Login Credientials !', status : false });
      }
      
    } else {
      res.status(404).json({ message: 'Rocord not found !!!', status : false });
    }
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error', status : false });
  }
}); 




module.exports = router
