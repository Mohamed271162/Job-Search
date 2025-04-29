import { Application } from "../../../database/models/application.models.js";
import { Company } from "../../../database/models/company.models.js";
import { Job } from "../../../database/models/job.models.js";
import { User } from "../../../database/models/user.models.js";
import { AppError } from "../../../utils/appError.js";
import { catchError } from "../../middleware/catcherror.js";

/**
 * @description Add a new company
 * @param {Object} req - Express request object containing company data
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route POST /api/companies
 * @access Private (Company_Hr)
 */
const addCompany = catchError(async (req, res, next) => {
  // Check if the company already exists by companyName or companyEmail
  const existingCompany = await Company.findOne({
    $or: [
      { companyName: req.body.companyName },
      { companyEmail: req.body.companyEmail },
    ],
  });

  if (existingCompany) {
    return next(new AppError("Company is already exists", 409));
  }

  // Get the logged-in user ID from the token
  const loggedInUserId = req.user.userId;

  // Check if the logged-in user has the role of Company_Hr
  if (req.user.role !== "Company_Hr") {
    return next(new AppError("Only Company HR can add a company", 403));
  }

  // Create a new company instance and save it
  const company = new Company({ ...req.body, addedBy: loggedInUserId });
  await company.save();
  res.status(201).json({ message: "Success", company });
});

/////////////////////////////////////////////////////////////////////

/**
 * @description Update a company by its ID
 * @param {Object} req - Express request object containing company ID and updated data
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route PUT /api/companies/:id
 * @access Private (Company_Hr)
 */
const updateCompany = catchError(async (req, res, next) => {
  // Find the company by ID
  let company = await Company.findById({ _id: req.params.id });
  if (!company) {
    return next(new AppError("Company is not found", 404));
  }

  // Check if the user is authorized to update the company
  if (company.companyHR.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this company", 403)
    );
  }

  // Update the company with the provided data
  let updatedCompany = await Company.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Company is updated successfully", updatedCompany });
});
/////////////////////////////////////////////////////////

/**
 * @description Delete a company by its ID
 * @param {Object} req - Express request object containing company ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route DELETE /api/companies/:id
 * @access Private (Company_Hr)
 */
const deleteCompany = catchError(async (req, res, next) => {
  // Find the company by ID
  let company = await Company.findById({ _id: req.params.id });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  // Check if the user is authorized to delete the company
  if (company.companyHR.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to delete this company", 403)
    );
  }

  // Delete the company from the database
  let deletedCompany = await Company.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ message: "Company is deleted successfully", deletedCompany });
});

/**
 * @description Get company data by its ID and associated jobs
 * @param {Object} req - Express request object containing company ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/companies/:id
 * @access Private (Company_Hr)
 */
const getCompanyData = catchError(async (req, res, next) => {
  // Find the company by ID
  let company = await Company.findById(req.params.id);
  if (!company) return next(new AppError("Company is not found", 404));

  // Find jobs associated with the company
  const jobs = await Job.find({ companyId: req.params.id });
  res.status(200).json({ message: "Success", company, jobs });
});

/**
 * @description Get company data by company name
 * @param {Object} req - Express request object containing company name
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/companies
 * @access Private (Company_Hr, User)
 */
const companyWithName = catchError(async (req, res, next) => {
  // Find companies by name
  let company = await Company.find({ companyName: req.body.companyName });
  if (company.length === 0)
    return next(new AppError("Company is not found", 404));

  // Respond with the found company
  res.status(200).json({
    message: "Success",
    data: company.map((company) => ({
      _id: company._id,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      description: company.description,
      address: company.address,
    })),
  });
});

/**
 * @description Get job applications for a specific job
 * @param {Object} req - Express request object containing job ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/companies/:id/applications
 * @access Private (Company_Hr)
 */
const getJobApplication = catchError(async (req, res, next) => {
  // Find the job by ID
  let job = await Job.findById(req.params.id);
  if (!job) return next(new AppError("Job is not found", 404));

  // Check if the user is authorized to access job applications
  if (job.addedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  // Find applications related to the job
  let application = await Application.find({ jobId: job._id });

  // Retrieve user details for each application
  let relatedApplication = await Promise.all(
    application.map(async (application) => {
      let user = await User.findById(application.userId);
      return { ...application.toObject(), user };
    })
  );

  if (relatedApplication.length === 0)
    return next(new AppError("No applications found", 404));

  // Respond with the related applications
  res.status(200).json({ message: "Success", relatedApplication });
});

export {
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyData,
  companyWithName,
  getJobApplication,
};
