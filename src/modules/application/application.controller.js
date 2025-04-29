import { AppError } from "../../../utils/appError.js";
import { Application } from "../../../database/models/application.models.js";
import { Job } from "../../../database/models/job.models.js";
import XLSX from "xlsx";
import { catchError } from "../../middleware/catcherror.js";
import { deleteOne } from "../../handlers/handlers.js";
import moment from "moment";
import { uploadResume } from "../../fileUploads/fileUpload.js";

/**
 * Add a new application and save it to the database.
 * @function addApplication
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @throws {AppError} If the application cannot be saved.
 */
const addApplication = catchError(async (req, res, next) => {
  // Check if the resume file is provided
  if (!req.file) {
    return next(new AppError("Please upload a resume file", 400)); // Bad Request error
  }

  let resumeUrl;
  // Upload the resume to Cloudinary
  try {
    resumeUrl = await uploadResume(req.file.path);
  } catch (error) {
    return next(new AppError(error.message));
  }

  // Store the Cloudinary URL in the request body
  req.body.resume = resumeUrl;

  // Create a new Application instance and save it to the database
  const application = new Application(req.body);
  await application.save();

  // Respond with success message and application data
  res.status(201).json({
    message: "Success",
    application,
    resumeUrl: resumeUrl,
  });
});
//////////////////////////////////////////////////////////////////

/**
 * Update an existing application in the database.
 * @function updateApplication
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @throws {AppError} If the application is not found.
 */
const updateApplication = catchError(async (req, res, next) => {
  // Update the application with the provided ID and request body
  let application = await Application.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true } // Return the updated application
  );

  // If the application is not found, return an error
  if (!application) return next(new AppError("application is not found", 404));

  // Respond with a success message and the updated application
  res
    .status(200)
    .json({ message: "application is updated successfully", application });
});
///////////////////////////////////////////////////////////////////////

/**
 * Delete an application from the database.
 * @function deleteApplication
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const deleteApplication = deleteOne(Application);
///////////////////////////////////////////////////////////////////////////

/**
 * Export applications to an Excel file based on company ID and date.
 * @function exportApplicationsToExcel
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @throws {AppError} If no jobs or applications are found for the given parameters.
 */
const exportApplicationsToExcel = catchError(async (req, res, next) => {
  const { companyId, date } = req.params;

  // Parse and format date (Assumes the date is passed in YYYY-MM-DD format)
  const startDate = moment(date).startOf("day"); // Start of the day
  const endDate = moment(date).endOf("day"); // End of the day

  // Find all jobs posted by this company
  const jobs = await Job.find({ companyId: companyId });

  // If no jobs are found, return an error
  if (jobs.length === 0)
    return next(new AppError("no jobs found for this company", 404));

  // Get the job IDs for filtering applications
  const jobIds = jobs.map((job) => job._id);

  // Fetch applications for these jobs on the specific date
  const applications = await Application.find({
    jobId: { $in: jobIds },
    createdAt: { $gte: startDate, $lte: endDate }, // Filter by creation date
  }).populate("jobId userId"); // Populate jobId and userId fields

  // If no applications are found, return an error
  if (applications.length === 0)
    return next(new AppError("no applications found for this date", 404));

  // Create a workbook and a worksheet
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  const worksheetData = applications.map((application) => ({
    JobTitle: application.jobId.jobTitle,
    ApplicantName: application.userId.username,
    TechnicalSkills: application.userTechnicalSkills.join(", "), // Join technical skills with commas
    SoftSkills: application.userSoftSkills.join(", "), // Join soft skills with commas
    ResumeLink: application.userResume, // Resume link
    DateApplied: moment(application.createdAt).format("YYYY-MM-DD HH:mm:ss"), // Format date
  }));

  // Add the header row to the worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

  // Convert workbook to buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  // Set response headers for Excel file download
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=applications-${companyId}-${date}.xlsx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  // Send the Excel file to the client
  res.status(200).send(buffer);
});

export {
  addApplication,
  updateApplication,
  deleteApplication,
  exportApplicationsToExcel,
};
