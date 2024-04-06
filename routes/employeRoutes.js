const express = require("express");
const router = express.Router();
const {
  homepage,
  employeSignup,
  employeLogin,
  employeLogout,
  currentUser,
  employeSendMail,
  employeForgotPassLink,
  employeResetPassword,
  employeUpdate,
  employeAvatar,
  createInternship,
  readInternship,
  readSingleInternship,
  createjob,
  readjob,
  readSingleJob
} = require("../controllers/employeControllers");
const { isAuthenticated } = require("../middlewares/auth");

// GET /employe
router.get("/", homepage);

// POST /currentuser
router.post("/currentuser", isAuthenticated, currentUser);

// POST /employe/signup
router.post("/signup", employeSignup);

// POST /employe/login
router.post("/login", employeLogin);

// GET /logout
router.get("/logout", isAuthenticated, employeLogout);

// POST /send-mail
router.post("/send-mail", employeSendMail);

// GET employe/forget-link/:id
router.get("/forget-link/:id", employeForgotPassLink);

// POST employe/reset-password/:id
router.post("/reset-password/:id",isAuthenticated, employeResetPassword);

// POST employe/update/:id
router.post("/update/:id",isAuthenticated, employeUpdate);

// POST employe/avatar/:id
router.post("/avatar/:id",isAuthenticated, employeAvatar);

// --------------Internship--------------

// POST /employe/internship/create
router.post("/internship/create",isAuthenticated, createInternship);

// POST /employe/internship/read
router.post("/internship/read",isAuthenticated, readInternship);

// POST /employe/internship/read/:id
router.post("/internship/read/:id",isAuthenticated, readSingleInternship);

// ------------------Jobs------------------

// POST /employe/jobs/create
router.post("/jobs/create",isAuthenticated, createjob);

// POST /employe/jobs/read
router.post("/jobs/read",isAuthenticated, readjob);

// POST /employe/jobs/read/:id
router.post("/jobs/read/:id",isAuthenticated, readSingleJob);

module.exports = router;
