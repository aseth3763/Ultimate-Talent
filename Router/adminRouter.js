const express = require("express")
const router = express.Router()
const upload = require("../multer")

const adminController = require("../Controller/adminController")

router.get("/getAdminDetail/:id",adminController.getAdminDetail)
router.put('/updateAdminDetail/:id',upload.single("profileImage"),adminController.updateAdminDetail)

router.post("/login",adminController.adminLogin)
router.post("/changePassword/:id",adminController.changePassword)
router.post("/generateOtp",adminController.generateOtp)
router.post("/verifyOtp",adminController.verifyOtp)
router.post("/resetPassword/:adminId",adminController.resetPassword)

router.get("/getAllClientData" , adminController.getAllClientData)
router.delete("/deleteClientDataByAdmin/:id" , adminController.deleteClientDataByAdmin)
router.put("/updateClientStatus/:id" , adminController.updateClientStatus)

router.get("/getAllUserData" , adminController.getAllUserData)
router.delete("/deleteUserDataByAdmin/:id" , adminController.deleteUserDataByAdmin)

module.exports = router