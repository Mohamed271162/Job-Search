import { Application } from "../../../database/models/application.models.js";
import { Company } from "../../../database/models/company.models.js";
import { Job } from "../../../database/models/job.models.js";
import { ApiFeatures } from "../../../utils/api.features.js";
import { AppError } from "../../../utils/appError.js";
import { addOne } from "../../handlers/handlers.js";
import { catchError } from "../../middleware/catcherror.js";

// Controller to add a new job
const addJob = addOne(Job);
///////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Update a job by its ID
 * @param {Object} req - Express request object containing job ID and updated data
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route PUT /api/jobs/:id
 * @access Private (Company_Hr)
 */
const updateJob = catchError(async (req, res, next) => {
  // Find the job by ID
  let job = await Job.findByIdAndUpdate({ _id: req.params.id });
  if (!job) return next(new AppError("Job is not found", 404));

  // Check if the user is authorized to update the job
  if (job.addedBy.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update this job", 403));
  }

  // Update the job with the provided data
  let updatedJob = await Job.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );

  // Respond with the updated job information
  res.status(200).json({ message: "Job is updated successfully", updatedJob });
});
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Delete a job by its ID
 * @param {Object} req - Express request object containing job ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route DELETE /api/jobs/:id
 * @access Private (Company_Hr)
 */
const deleteJob = catchError(async (req, res, next) => {
  // Find the job by ID
  const job = await Job.findById(req.params.id);

  // Check if the job exists
  if (!job) return next(new AppError("Job is not found", 404));

  // Check if the user is authorized to delete the job
  if (job.addedBy.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to delete this job", 403));
  }

  await job.remove();

  // Respond with success message
  res.status(200).json({ message: "Job is deleted successfully", job });
});
/////////////////////////////////////////////////////////////////////

/**
 * @description Get a job and its associated company by job ID
 * @param {Object} req - Express request object containing job ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/jobs/:id
 * @access Private (Company_Hr, User)
 */
const JobWithTheirCompany = catchError(async (req, res, next) => {
  // Find the job by ID
  let job = await Job.findById(req.params.id);
  if (!job) return next(new AppError("Job is not found", 404));

  // Find the associated company by job ID
  let company = await Company.find({ jobId: req.params.id });
  res.status(200).json({ message: "Success", job, company });
});
////////////////////////////////////////////////////////////////////////

/**
 * @description Get jobs by company name
 * @param {Object} req - Express request object containing company name
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/jobs
 * @access Private (Company_Hr, User)
 */
const jobWithCompanyName = catchError(async (req, res, next) => {
  // Find the company by name
  const company = await Company.findOne({ companyName: req.body.companyName });
  if (!company) return next(new AppError("Company is not found", 404));

  // Find jobs associated with the company
  const jobs = await Job.find({ companyId: company._id });
  if (jobs.length === 0)
    return next(new AppError("This company has no jobs", 404));

  // Respond with the list of jobs
  res.status(200).json({ message: "Success", jobs });
});
/////////////////////////////////////////////////////////////////////////////

/**
 * @description Filter jobs based on various criteria
 * @param {Object} req - Express request object containing query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/jobs/filter
 * @access Private (Company_Hr, User)
 */
const jobWithFilter = catchError(async (req, res, next) => {
  // Create API features instance for filtering
  let apiFeatures = new ApiFeatures(Job.find(), req.query)
    .workingTime()
    .jobLocation()
    .seniorityLevel()
    .jobTitle()
    .technicalSkills();

  // Execute the query with applied filters
  let jobs = await apiFeatures.mongooseQuery;
  res.status(200).json({ message: "Success", jobs });
});

export {
  addJob,
  updateJob,
  deleteJob,
  JobWithTheirCompany,
  jobWithCompanyName,
  jobWithFilter,
};
