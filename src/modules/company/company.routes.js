import { Router } from "express";
import {
  addCompany,
  companyWithName,
  deleteCompany,
  getCompanyData,
  getJobApplication,
  updateCompany,
} from "./company.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { addCompanySchema, updateCompanySchema } from "./company.validation.js";

const companyRoutes = Router();

companyRoutes.post(
  "/",
  validate(addCompanySchema),
  protectedRoutes,
  allowedTo("Company_Hr"),
  addCompany
);
companyRoutes.put(
  "/:id",
  validate(updateCompanySchema),
  protectedRoutes,
  allowedTo("Company_Hr"),
  updateCompany
);
companyRoutes.delete(
  "/:id",
  protectedRoutes,
  allowedTo("Company_Hr"),
  deleteCompany
);

companyRoutes.get(
  "/:id",
  protectedRoutes,
  allowedTo("Company_Hr"),
  getCompanyData
);

companyRoutes.get(
  "/",
  protectedRoutes,
  allowedTo("Company_Hr", "User"),
  companyWithName
);

companyRoutes.get(
  "/:id/applications",
  protectedRoutes,
  allowedTo("Company_Hr"),
  getJobApplication
);

export default companyRoutes;
