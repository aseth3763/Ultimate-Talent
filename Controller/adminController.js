const adminModel = require("../Model/AdminModel");
const bcrypt = require("bcrypt");
const otpModel = require("../Model/OtpModel");
const admin_otp_email = require("../utils/otp_email");
const clientModel = require("../Model/ClientModel")
const UserModel = require("../Model/UserModel")

//login

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password required",
      });
    }

    const admin = await adminModel.findOne({ email });

    console.log(admin);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email",
      });
    }

    if (admin.password && admin.password.startsWith("$2b$")) {
      const matchPassword = await bcrypt.compare(password, admin.password);
      if (!matchPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      console.log(hashedPassword);

      admin.password = hashedPassword;

      const matchPassword = bcrypt.compare(password, admin.password);

      await admin.save();
      if (!matchPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Admin login Successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//change paassword

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user ID.",
      });
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;
    console.log(oldPassword);

    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old password",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide confirm password",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password can't be same",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const admin = await adminModel.findById(id);

    console.log(admin.password);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin Not Found",
      });
    }

    const matchPassword = await bcrypt.compare(oldPassword, admin.password);
    console.log(matchPassword);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Your old Password is incorrect",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashPassword;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password Changed",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Admin Details (get)

const getAdminDetail = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user ID.",
      });
    }

    const adminData = await adminModel.findById(id);

    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      data: adminData,
    });
  } catch (error) {
    console.error("Error fetching admin details:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Update Admin Details

const updateAdminDetail = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Admin ID required",
      });
    }

    const { name, email } = req.body;

    const expectedFields = ["name", "email", "profileImage"];
    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !expectedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid fields provided",
        invalidFields: invalidFields,
      });
    }

    const admin = await adminModel.findById(id);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin details not found",
      });
    }

    admin.email = email || admin.email;
    admin.name = name || admin.name;

    if (req.file) {
      admin.profileImage = req.file.filename;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin details updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error_message: error.message,
    });
  }
};

// Forget Password
// generate otp

const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const length = Math.floor(Math.random() * 3) + 4;
    let otp = "";

    otp += Math.floor(Math.random() * 9) + 1;
    for (let i = 1; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    const otpData = {
      otp: otp,
    }

    const existingOtp = await otpModel.findOne({ adminId: admin._id });

    if (existingOtp) {
      await otpModel.updateOne({ adminId: admin._id }, otpData);
    } else {
      otpData.adminId = admin._id;
      await otpModel.create(otpData);
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;">
    <div style="max-width: 600px; margin: 20px auto; padding: 30px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); border-top: 5px solid #007bff;">
        <h2 style="font-size: 26px; color: #333; margin-bottom: 20px; text-align: center;">Your OTP Code</h2>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            <strong>Hello ${admin.name} </strong>
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Your one-time password (OTP) is:
        </p>
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 36px; color: #ffffff; background-color: #007bff; margin: 0; padding: 15px 0; border-radius: 5px; display: inline-block;">
                <strong>${otp}</strong>
            </h1>
        </div>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Please use this OTP to complete your verification. The OTP is valid for <strong>10 minutes</strong>.
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            If you did not request this code, please ignore this email.
        </p>
        <p style="font-size: 18px; color: #444; text-align: center;">
            Best regards,<br>
            <strong>Admin Team</strong>
        </p>
    </div>
</body>
</html>`;

    await admin_otp_email(email, "Forget password otp", htmlContent);

    return res.status(200).json({
      success: true,
      message: "You should receive an OTP",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// verify otp

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Otp required",
      });
    }

    const otpData = await otpModel.findOne({ otp });
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "The OTP you entered is incorrect.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your OTP has been verified successfully.",
      adminId : otpData.adminId
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// reset password

const resetPassword = async(req,res)=> {
  try {

    const {adminId} = req.params
    if(!adminId){
      return res.status(400).json({
        success:false,
        message : "id required"
      })
    }

    const {  newPassword, confirmNewPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter new password",
      });
    }

    if (!confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter confirm new password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    } 

    const admin = await adminModel.findOne({ _id : adminId })
    if(!admin){
      return res.status(400).json({
        success:false,
        message : "Admin not found"
      })
    }


    const matchPassword = await bcrypt.compare(newPassword,admin.password)

    
    if (matchPassword) {
      return res.status(400).json({
        success: false,
        message: "old password and new password can not be same",
      });
    }

    admin.password= await bcrypt.hash(newPassword,10)
    await admin.save()
    await otpModel.deleteOne({adminId})

    return res.status(200).json({
      success:true,
      message : "Reset password successfully",
      data : admin
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// get all client data

const getAllClientData = async(req,res)=> {
  try {
    const getAllClientData = await clientModel.find()
    if(!getAllClientData || getAllClientData.length ===0){
      return res.status(400).json({
        success:false,
        message : "No client data found",
      })
    }

    return res.status(200).json({
      success : true,
      message : "All client data retrieve successfully",
      data : getAllClientData
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// delete client data by id

const deleteClientDataByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const deleteData = await clientModel.findByIdAndDelete(id);

    if (!deleteData) {
      return res.status(404).json({
        success: false,
        message:
          "No client found with the provided ID. Please check the ID and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully.",
      data: deleteData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update client status

const updateClientStatus = async(req,res)=> {
  try {

    const {id} = req.params
    if(!id){
      return res.status(400).json({
        success: false,
        message : "Enter id"
      })
    }

    const client = await clientModel.findById(id)
    if(!client){
      return res.status(400).json({
        success: false,
        message : "Client not found"
      })
    }

    if(client.status === 1){
      client.status = 0
      await client.save()
      return res.status(200).json({
        success:true,
        message : "Client status suspended"
      })
    }

    if(client.status === 0){
      client.status = 1
      await client.save()
      return res.status(200).json({
        success:true,
        message : "Client status activated"
      })
    }


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// get all user data

const getAllUserData = async(req,res)=> {
  try {
    const getAllUserData = await UserModel.find()
    if(!getAllUserData || getAllUserData.length === 0){
      return res.status(400).json({
        success:false,
        message : "No user data found",
      })
    }

    return res.status(200).json({
      success : true,
      message : "All user data retrieve successfully",
      data : getAllUserData
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// delete user data by id

const deleteUserDataByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const deleteData = await UserModel.findByIdAndDelete(id);

    if (!deleteData) {
      return res.status(404).json({
        success: false,
        message:
          "No user found with the provided ID. Please check the ID and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user data  deleted successfully.",
      data: deleteData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  changePassword,
  getAdminDetail,
  updateAdminDetail,
  generateOtp,
  verifyOtp,
  resetPassword,
  getAllClientData,
  updateClientStatus,
  deleteClientDataByAdmin,
  getAllUserData,
  deleteUserDataByAdmin
};


