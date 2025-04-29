import applicationRoutes from "./application/application.routes.js";
import companyRoutes from "./company/company.routes.js";
import jobRoutes from "./job/job.routes.js";
import userRoutes from "./user/user.routes.js";

export const bootstrap = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/companies", companyRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/applications", applicationRoutes);
};
