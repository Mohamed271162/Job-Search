import {
  addApplication,
  deleteApplication,
  exportApplicationsToExcel,
  updateApplication,
} from "./application.controller.js";
import {
  addApplicationValidSchema,
  updateApplicationValidSchema,
} from "../application/application.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

import { Router } from "express";
import { upload } from "../../middleware/fileUploadsMiddleware.js";
import { validate } from "../../middleware/validate.js";

const applicationRoutes = Router();

applicationRoutes.post(
  "/upload",
  protectedRoutes,
  allowedTo("User"),
  upload.single("resume"),
  validate(addApplicationValidSchema),
  addApplication
);

applicationRoutes.get(
  "/:companyId/:date",
  protectedRoutes,
  allowedTo("Company_Hr"),
  exportApplicationsToExcel
);

applicationRoutes.put(
  "/:id",
  protectedRoutes,
  allowedTo("User"),
  upload.single("resume"),
  validate(updateApplicationValidSchema),
  updateApplication
);

applicationRoutes.delete(
  "/:id",
  protectedRoutes,
  allowedTo("User"),
  upload.single("resume"),
  deleteApplication
);

export default applicationRoutes;
