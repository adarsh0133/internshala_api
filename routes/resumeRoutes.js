const express = require("express");
const router = express.Router();
const {
  addEducation,
  editEducation,
  deleteEducation,
  editJob,
  addJob,
  deleteJob,
  addInternship,
  editInternship,
  deleteInternship,
  addResponsibilities,
  editResponsibilities,
  deleteResponsibilities,
  resume,
} = require("../controllers/resumeControllers");
const { isAuthenticated } = require("../middlewares/auth");

// GET /
router.get("/", isAuthenticated, resume);

// Add Edit Delete Education ----------

// POST /add-edu
router.post("/add-edu", isAuthenticated, addEducation);

// POST /edit-edu/:eduid
router.post("/edit-edu/:eduid", isAuthenticated, editEducation);

// POST /del-edu/:eduid
router.post("/del-edu/:eduid", isAuthenticated, deleteEducation);

// -------------------------------------

// Add Edit Delete Jobs ----------
//POST
router.post("/add-job", isAuthenticated, addJob);

//POST
router.post("/edit-job/:jobid", isAuthenticated, editJob);

//POST
router.post("/del-job/:jobid", isAuthenticated, deleteJob);

// --------------------------------

// Add Edit Delete Internship ----------

//POST
router.post("/add-internship", isAuthenticated, addInternship);

//POST
router.post("/edit-internship/:internshipid", isAuthenticated, editInternship);

//POST
router.post("/del-internship/:internshipid", isAuthenticated, deleteInternship);

// --------------------------------------

// Add Edit Delete Responsibility ----------

//POST
router.post("/add-responsibilities", isAuthenticated, addResponsibilities);

//POST
router.post(
  "/edit-responsibilities/:responsibilitiesid",
  isAuthenticated,
  editResponsibilities
);

//POST
router.post(
  "/del-responsibilities/:responsibilitiesid",
  isAuthenticated,
  deleteResponsibilities
);

// --------------------------------------


module.exports = router;
