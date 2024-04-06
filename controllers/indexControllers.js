const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModel");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");
const errorHandler = require("../utils/errorHandler");
const { sendtoken } = require("../utils/SendToken");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imageKit").initImageKit();

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  const internship = await Internship.find().exec();
  const job = await Job.find().exec();
  res.json({ message: "helllo", internship, job });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const student = await Student
    .findById(req.id)
    .populate({
      path: "appliedinternships",
      populate: {
        path: "employe",
        model: "employe", 
      },
    })
    .populate({
      path: "appliedjobs",
      populate: {
        path: "employe",
        model: "employe", 
      },
    })
    .exec();

  res.json({ student });
});

exports.appliedInternship = catchAsyncErrors(async (req, res, next) => {
  const appliedIntern = await Student.findById(req.id)
    .populate("appliedinternships")
    .exec();

  res.json({ appliedIntern });
});

exports.appliedJobs = catchAsyncErrors(async (req, res, next) => {
  const appliedJobs = await Student.findById(req.id)
    .populate("appliedjobs")
    .exec();

  res.json({ appliedJobs });
});

exports.studentSignup = catchAsyncErrors(async (req, res, next) => {
  const student = await new Student(req.body).save();
  sendtoken(student, 201, res);
});

exports.studentLogin = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!student)
    return next(
      new errorHandler("user not found with this email address", 404)
    );
  const isMatch = student.comparepassword(req.body.password);
  if (!isMatch) return next(new errorHandler("wrong credientials", 500));

  sendtoken(student, 200, res);
});

exports.studentLogout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully logout!" });
});

exports.studentSendMail = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email }).exec();
  if (!student)
    return next(
      new errorHandler("user not found with this email address", 404)
    );
  const url = `${req.protocol}://${req.get("host")}/student/forget-link/${
    student._id
  }`;

  sendmail(req, res, next, url);
  student.resetPassToken = "1";
  await student.save();
  // res.json({ student, url});
});

exports.studentForgotPassLink = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();

  if (!student)
    return next(
      new errorHandler("user not found with this email address", 404)
    );

  if (student.resetPassToken == "1") {
    student.resetPassToken = "0";
    student.password = req.body.password;
  } else {
    return next(
      new errorHandler("Invalid Password Link! Please try again", 404)
    );
  }

  await student.save();

  res.status(200).json({
    message: "Password has been successfully changed",
  });
});

exports.studentResetPassword = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  student.password = req.body.password;
  await student.save();

  sendtoken(student, 201, res);
});

exports.studentUpdate = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Student Updated Successfully!",
    student,
  });
});

exports.studentAvatar = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  const file = req.files.avatar;
  const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
    file.name
  )}`;

  if (student.avatar.fileId !== "") {
    await imagekit.deleteFile(student.avatar.fileId);
  }

  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });

  student.avatar = { fileId, url };
  await student.save();

  res.status(200).json({
    success: true,
    message: "Student Profile Image Uploaded Successfully!",
  });
});

// -----------apply Internship------------------

exports.applyinternship = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const internship = await Internship.findById(req.params.internshipid).exec();

  student.appliedinternships.push(internship._id);
  internship.students.push(student._id);

  await student.save();
  await internship.save();

  res.status(201).json({
    success: true,
    message: "Student Apply For Internship Successfully!",
  });
});

// -------------apply jobs-----------------------

exports.applyjob = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const job = await Job.findById(req.params.jobid).exec();

  student.appliedjobs.push(job._id);
  job.students.push(student._id);

  await student.save();
  await job.save();

  res.status(201).json({
    success: true,
    message: "Student Apply For Job Successfully!",
  });
});
