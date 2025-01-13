const express = require("express");
const router = express.Router();
const upload =  require("../multer")
const consultancyController = require("../Controller/consultancyController");

// Router for job vacancy
router.post("/createJobVacancy/:clientId", upload.single('jobProfileImage'),consultancyController.createJobVacancy);
router.get("/getAllJobVacancies", consultancyController.getAllJobVacancies);
router.get("/getJobVacancyById/:id", consultancyController.getJobVacancyById );
router.put("/updateJobVacancyById/:id", upload.single('jobProfileImage') ,consultancyController.updateJobVacancyById );
router.delete("/deleteJobVacancyData/:id", consultancyController.deleteJobVacancyData );

// Router for training course
router.post("/addTrainingCourse/:clientId", upload.single('image') , consultancyController.addTrainingCourse);
router.get("/getAllTrainingCourses", consultancyController.getAllTrainingCourses);
router.get("/getSingleTrainingCourseById/:id", consultancyController.getSingleTrainingCourseById);
router.put("/updateTrainingCourseData/:id", upload.single('image'), consultancyController.updateTrainingCourseData);
router.delete("/deleteTrainingCourseData/:id", consultancyController.deleteTrainingCourseData );

// Router for Hr Article
router.post("/createHrArticle/:clientId",upload.single("articleImage"), consultancyController.createHrArticle );
router.get("/getAllHrAticles", consultancyController.getAllHrAticles );
router.get("/getHrArticleById/:id", consultancyController.getHrArticleById );
router.put("/updateHrArticleDataById/:id", upload.single('articleImage'), consultancyController.updateHrArticleDataById);
router.delete("/deleteHrArticleDataById/:id", consultancyController.deleteHrArticleDataById );

// Router for Latest Activity
router.post("/createLatestActivity/:clientId",upload.single("activityImage"), consultancyController.createLatestActivity);
router.get("/getAllLatestActivities", consultancyController.getAllLatestActivities);
router.get("/getLatestActivityById/:id", consultancyController.getLatestActivityById);
router.put("/updateLatestActivityDataById/:id",upload.single("activityImage"), consultancyController.updateLatestActivityDataById);
router.delete("/deleteLatestActivityDataById/:id", consultancyController.deleteLatestActivityDataById);

// Router for Client
router.post("/createClient" , upload.single("profileImage"), consultancyController.createClient)
router.get("/getClientDataById/:id" , consultancyController.getClientDataById)
router.get("/getAllClientData" , consultancyController.getAllClientData)
router.put("/updateClientDataById/:id" , upload.single("profileImage"), consultancyController.updateClientDataById)
router.delete("/deleteClientDataById/:id" , consultancyController.deleteClientDataById)
router.post("/clientLogin",consultancyController.clientLogin)
router.post("/changePassword/:id",consultancyController.changePassword)
router.post("/generateOtp",consultancyController.generateOtp)
router.post("/verifyOtp",consultancyController.verifyOtp)
router.post("/resetPassword/:clientId",consultancyController.resetPassword)

// Router for User
router.post("/createUser" , upload.single("profileImage"), consultancyController.createUser)
router.get("/getUserDataById/:id" , consultancyController.getUserDataById)
router.put("/updateUserDataById/:id" , upload.single("profileImage"), consultancyController.updateUserDataById)
router.delete("/deleteUserDataById/:id" , consultancyController.deleteUserDataById)
router.post("/userLogin",consultancyController.userLogin)
router.post("/change_password/:id",consultancyController.change_password)
router.post("/generate_otp",consultancyController.generate_otp)
router.post("/verify_otp",consultancyController.verify_otp)
router.post("/reset_password/:userId",consultancyController.reset_password)

// Router for registration Training
router.post("/createRegistration/:trainingId/:userId",upload.single("profileImage"),consultancyController.createRegistration)
router.get("/getAllTrainingRegistration",consultancyController.getAllTrainingRegistration)
router.get("/getTrainingRegistrationById/:id",consultancyController.getTrainingRegistrationById)
router.put("/updateTrainingRegistration/:id",upload.single("profileImage"),consultancyController.updateTrainingRegistration)
router.delete("/deleteTrainingRegistration/:id",consultancyController.deleteTrainingRegistration)

// Router for create Training Request
router.post("/createTrainingRequest/:trainingId/:userId",consultancyController.createTrainingRequest)
router.get("/getAllTrainingRequest",consultancyController.getAllTrainingRequest)
router.get("/getTrainingRequestById/:id",consultancyController.getTrainingRequestById)
router.put("/updateTrainingRequest/:id",consultancyController.updateTrainingRequest)
router.delete("/deleteTrainingRequest/:id",consultancyController.deleteTrainingRequest)

// Router for Trainer Registration
router.post('/createTrainerRegistration/:userId', upload.fields([
    // { name: 'profileImage', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'certificates', maxCount: 5 }
  ]), consultancyController.createTrainerRegistration);
router.get("/getAllTrainerRegistrations",consultancyController.getAllTrainerRegistrations)
router.get("/getTrainerRegistrationById/:id",consultancyController.getTrainerRegistrationById)
router.put('/updateTrainer/:id', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'certificates', maxCount: 5 }
  ]), consultancyController.updateTrainerRegistration);
router.delete("/deleteTrainerRegistration/:id",consultancyController.deleteTrainerRegistration)

// Router for contact us
router.post("/createContactUs/:clientId",consultancyController.createContactUs)
router.get("/getAllContactUs",consultancyController.getAllContactUs)

// Router for cv submit
router.post("/createCvSubmit/:userId",upload.single("cv"),consultancyController.createCvSubmit)
router.get("/getCvSubmit",consultancyController.getCvSubmit)
router.put("/updateCvSubmitById/:id",upload.single("cv"),consultancyController.updateCvSubmitById)
router.delete("/deleteCvSubmitById/:id",consultancyController.deleteCvSubmitById)

// Router for applicant cv
router.post('/createApplicantCv/:userId',upload.fields([{ name: 'profileImage' }, { name: 'logo' }]),consultancyController.createApplicantCv)
router.get('/getAllApplicantCv',consultancyController.getAllApplicantCv)
router.put("/updateApplicantCvData/:id",upload.fields([{name : "profileImage"},{name : "logo"}]),consultancyController.updateApplicantCvData)
router.delete('/deleteApplicantCvData/:id',consultancyController.deleteApplicantCvData)

// Router for CMS
router.post("/createAndUpdateCmsData",upload.fields([{name:"bannerImage",maxCount:1},
  {name : "aboutImage",maxCount : 1},
  {name:"footerImage",maxCount : 1}
]),consultancyController.createAndUpdateCmsData)
router.get("/getCmsData",consultancyController.getCmsData)

module.exports = router;
