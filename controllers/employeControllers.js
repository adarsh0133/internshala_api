const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Employe = require("../models/employeModel");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");
const errorHandler = require("../utils/errorHandler");
const { employesendtoken } = require("../utils/employeSendToken");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imageKit").initImageKit();

exports.homepage = catchAsyncErrors((req, res, next) => {
  res.json({ message: "Employe Page" });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id)
    .populate({
      path: "internships",
      populate: {
        path: "students",
        model: "student",
      },
    })
    .populate({
      path: "jobs",
      populate: {
        path: "students",
        model: "student",
      },
    })
    .exec();
  res.json({ employe });
});

exports.employeSignup = catchAsyncErrors(async (req, res, next) => {
  const employe = await new Employe(req.body).save();
  employesendtoken(employe, 201, res);
});

exports.employeLogin = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!employe)
    return next(
      new errorHandler("user not found with this email address", 404)
    );
  const isMatch = employe.comparepassword(req.body.password);
  if (!isMatch) return next(new errorHandler("wrong credientials", 500));

  employesendtoken(employe, 200, res);
});

exports.employeLogout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully logout!" });
});

exports.employeSendMail = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email }).exec();
  if (!employe)
    return next(
      new errorHandler("user not found with this email address", 404)
    );
  const url = `${req.protocol}://${req.get("host")}/employe/forget-link/${
    employe._id
  }`;

  sendmail(req, res, next, url);
  employe.resetPasswordToken = "1";
  await employe.save();
  // res.json({ employe, url});
});

exports.employeForgotPassLink = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();

  if (!employe)
    return next(
      new errorHandler("user not found with this email address", 404)
    );

  if (employe.resetPasswordToken == "1") {
    employe.resetPasswordToken = "0";
    employe.password = req.body.password;
  } else {
    return next(
      new errorHandler("Invalid Password Link! Please try again", 404)
    );
  }

  await employe.save();

  res.status(200).json({
    message: "Password has been successfully changed",
  });
});

exports.employeResetPassword = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  employe.password = req.body.password;
  await employe.save();

  employesendtoken(employe, 201, res);
});

exports.employeUpdate = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findByIdAndUpdate(
    req.params.id,
    req.body
  ).exec();

  res.status(200).json({
    success: true,
    message: "employe Updated Successfully!",
    employe,
  });
});

exports.employeAvatar = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();
  const file = req.files.organizationLogo;
  const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
    file.name
  )}`;

  if (employe.organizationlogo.fileId !== "") {
    await imagekit.deleteFile(employe.organizationlogo.fileId);
  }

  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });

  employe.organizationLogo = { fileId, url };
  await employe.save();

  res.status(200).json({
    success: true,
    message: "employe Profile Image Uploaded Successfully!",
  });
});

// -----------------Internship--------------------

exports.createInternship = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  const internship = await new Internship(req.body).save();
  internship.employe = employe._id;
  employe.internships.push(internship._id);
  await internship.save();
  await employe.save();
  res.status(201).json({ success: true, internship });
});

exports.readInternship = catchAsyncErrors(async (req, res, next) => {
  const { internship } = await Employe.findById(req.id)
    .populate("internships")
    .exec();
  res.status(201).json({ success: true, internship });
});

exports.readSingleInternship = catchAsyncErrors(async (req, res, next) => {
  const internship = await Internship.findById(req.params.id).exec();
  res.status(201).json({ success: true, internship });
});

// -----------------Jobs--------------------

exports.createjob = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  const job = await new Job(req.body).save();
  job.employe = employe._id;
  employe.jobs.push(job._id);
  await job.save();
  await employe.save();
  res.status(201).json({ success: true, job });
});

exports.readjob = catchAsyncErrors(async (req, res, next) => {
  const { job } = await Employe.findById(req.id).populate("jobs").exec();
  res.status(201).json({ success: true, job });
});

exports.readSingleJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id).exec();
  res.status(201).json({ success: true, job });
});
