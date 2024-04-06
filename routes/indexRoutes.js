const express = require("express");
const router = express.Router();
const {
  homepage,
  studentSignup,
  studentLogin,
  studentLogout,
  currentUser,
  studentSendMail,
  studentForgotPassLink,
  studentResetPassword,
  studentUpdate,
  studentAvatar,
  applyinternship,
  applyjob,
  appliedInternship,
  appliedJobs
} = require("../controllers/indexControllers");
const { isAuthenticated } = require("../middlewares/auth");

// GET /
router.get("/", homepage);

// POST /student
router.post("/student", isAuthenticated, currentUser);

// POST /student/appliedInternship
router.post("/student/appliedInternship", isAuthenticated, appliedInternship);

// POST /student/appliedJobs
router.post("/student/appliedJobs", isAuthenticated, appliedJobs);

// POST /student/signup
router.post("/student/signup", studentSignup);

// POST /student/login
router.post("/student/login", studentLogin);

// GET /student/logout
router.get("/student/logout", isAuthenticated, studentLogout);

// POST /student/send-mail
router.post("/student/send-mail", studentSendMail);

// GET student/forget-link/:id
router.get("/student/forget-link/:id", studentForgotPassLink);

// POST student/reset-password/:id
router.post("/student/reset-password/:id",isAuthenticated, studentResetPassword);

// POST student/update/:id
router.post("/student/update/:id",isAuthenticated, studentUpdate);

// POST student/avatar/:id
router.post("/student/avatar/:id",isAuthenticated, studentAvatar);

// ---------------apply Internship---------

//POST /student/apply/:internshipid
router.post("/student/apply/:internshipid", isAuthenticated, applyinternship);

// ---------------apply job---------

//POST /student/apply/:jobid
router.post("/student/apply/job/:jobid", isAuthenticated, applyjob);

module.exports = router;
