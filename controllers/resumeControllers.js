const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModel");
const errorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

exports.resume = catchAsyncErrors(async (req, res, next) => {
  const loggedinuserresume = await Student.findById(req.id).populate().exec();
  res.json({ message: "resume page", loggedinuserresume });
});

// Add Edit Delete Education ----------

exports.addEducation = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  student.resume.education.push({ ...req.body, id: uuidv4() });
  await student.save();
  res.json({ message: "Education added Successfully!" });
});

exports.editEducation = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const eduIndex = student.resume.education.findIndex(
    (i) => i.id === req.params.eduid
  );

  student.resume.education[eduIndex] = {
    ...student.resume.education[eduIndex],
    ...req.body,
  };

  await student.save();
  res.json({ message: "Education Updated Successfully!" });
});

exports.deleteEducation = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const filteredEdu = student.resume.education.filter(
    (i) => i.id !== req.params.eduid
  );

  student.resume.education = filteredEdu;
  await student.save();
  res.json({ message: "Education Deleted Successfully!" });
});

// -----------------------------------

// Add Edit Delete jobs ----------

exports.addJob = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  student.resume.jobs.push({ ...req.body, id: uuidv4() });
  await student.save();
  res.json({ message: "Job Added Successfully!" });
});

exports.editJob = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const jobIndex = student.resume.jobs.findIndex(
    (i) => i.id === req.params.jobid
  );
  student.resume.jobs[jobIndex] = {
    ...student.resume.jobs[jobIndex],
    ...req.body,
  };
  await student.save();
  res.json({ message: "jobs edited" });
});

exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const filterIndex = student.resume.jobs.filter(
    (i) => i.id !== req.params.jobid
  );
  student.resume.jobs = filterIndex;
  await student.save();
  res.json({ message: "jobs deleted" });
});

// ---------------------------------

// Add Edit Delete Internship -----------

exports.addInternship = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  student.resume.internships.push({ ...req.body, id: uuidv4() });
  await student.save();
  res.json({ message: "internship add" });
});

exports.editInternship = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const InternshipIndex = student.resume.internships.findIndex(
    (i) => i.id === req.params.internshipid
  );
  student.resume.internships[InternshipIndex] = {
    ...student.resume.internships[InternshipIndex],
    ...req.body,
  };
  await student.save();
  res.json({ message: "internships edited" });
});

exports.deleteInternship = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const filterIndex = student.resume.internships.filter(
    (i) => i.id !== req.params.internshipid
  );
  student.resume.internships = filterIndex;
  await student.save();
  res.json({ message: "internships deleted" });
});

// --------------------------------------

// Add Edit Delete Responsibilities -----------

exports.addResponsibilities = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  student.resume.responsibilities.push({ ...req.body, id: uuidv4() });
  await student.save();
  res.json({ message: "internship add" });
});

exports.editResponsibilities = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const ResponsibilitiesIndex = student.resume.responsibilities.findIndex(
    (i) => i.id === req.params.responsibilitiesid
  );
  student.resume.responsibilities[ResponsibilitiesIndex] = {
    ...student.resume.responsibilities[ResponsibilitiesIndex],
    ...req.body,
  };
  await student.save();
  res.json({ message: "Responsibilities edited" });
});

exports.deleteResponsibilities = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const filterIndex = student.resume.responsibilities.filter(
    (i) => i.id !== req.params.responsibilitiesid
  );
  student.resume.responsibilities = filterIndex;
  await student.save();
  res.json({ message: "responsibilities deleted" });
});

// --------------------------------------

//       courses:[],
//       projects:[],
//       skills:[],
//       accomplishment:[],
