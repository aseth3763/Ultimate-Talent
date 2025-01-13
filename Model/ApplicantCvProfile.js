const mongoose = require("mongoose")

const applicantCvSchema = new mongoose.Schema({
    applicantName : {
        type : String
    },
    personalInformation : {
        place : {
            type : String
        },
        nationality : {
            type : String
        },
        dob : {
            type : Date
        },
        gender : {
            type : String
        },
        maritalStatus : {
            type : String
        },
        email : {
            type : String
        },
        currentAddress : {
            type  : String
        },
        permanentAddress : {
            type : String
        },
        phone : {
            type : String
        },
        expectedSalary : {
            type : String
        },
        profileImage : {
            type :String
        }
    },
    education : [{
        degree : {
            type : String
        },
        major : {
            type : String
        },
        university : {
            type : String
        },
        city : {
            type : String
        },
        country : {
            type : String
        },
        graduationMonth : {
            type : String
        },
        graduationYear : {
            type : Number
        }
    }],
    languageSkills : [{
        name : {
            type : String
        },
        fluencyLevel : {
            type : String,
            enum : ["Native" , "Fluent","Very Good", "Good", "Fair","Basic"]
        }
    }],
    computerSkills : {
        type : String
    },
    trainingAndWorkshops : [{
        nameOfTraining : {
            type : String
        },
        organization : {
            type :String
        },
        city : {
            type : String
        },
        country : {
            type : String
        },
        month : {
            type :Number
        },
        year : {
            type: Number
        }
    }],
    professionalMembership : [{
        institueName : {
            type :  String
        },
        yearOfMembership : {
            type :Number
        }
    }],
    experience : [{
        positionName : {
            type : String
        },
        employerName : {
            type : String
        },
        speciality : {
            type : String
        },
        employerWebsite  : {
            type  :String
        },
        logo: {
            type : String
        },
        fromMonth : {
            type : Date
        },
        toMonth : {
            type  : Date
        }
    }],
    dutiesAndResponsibilities : {
        type : [String]
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
}, {timestamps :  true})

const applicantCvModel = mongoose.model("applicantCvModel",applicantCvSchema)

module.exports = applicantCvModel;

