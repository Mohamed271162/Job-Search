import { Router } from "express";
import {
  addJob,
  deleteJob,
  jobWithCompanyName,
  jobWithFilter,
  JobWithTheirCompany,
  updateJob,
} from "./job.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { addJobSchema, updateJobSchema } from "./job.validation.js";

const jobRoutes = Router();

jobRoutes.post(
  "/",
  validate(addJobSchema),
  protectedRoutes,
  allowedTo("Company_Hr"),
  addJob
);

jobRoutes.get(
  "/",
  protectedRoutes,
  allowedTo("Company_Hr", "User"),
  jobWithCompanyName
);

jobRoutes.get(
  "/filter",
  protectedRoutes,
  allowedTo("Company_Hr", "User"),
  jobWithFilter
);

jobRoutes.put(
  "/:id",
  validate(updateJobSchema),
  protectedRoutes,
  allowedTo("Company_Hr"),
  updateJob
);
jobRoutes.delete("/:id", protectedRoutes, allowedTo("Company_Hr"), deleteJob);
jobRoutes.get(
  "/:id",
  protectedRoutes,
  allowedTo("Company_Hr", "User"),
  JobWithTheirCompany
);
export default jobRoutes;
