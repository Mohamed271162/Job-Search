# Job-Search
# Job-Search-App
JOP-SEARCH-APP

🚀 Job Search App This application allows users to search for jobs relevant to their domain or area of interest, providing job filters, company data management, job application handling, and more.

📑 Table of Contents 🌟 Features 💻 Technologies Used ⚙️ Installation 🔧 Usage 📚 API Documentation 🤝 Contributing

🌟 Features 🔍 Filter Option: Users can filter jobs by working time, location, seniority level, job title, and technical skills. 👤 User Data Management: Handles user accounts, including sign-up, login, update, and deletion. 🏢 Company Data Management: Allows companies to manage their profiles, including adding, updating, and deleting jobs. 📄 Job Application Management: Users can apply to jobs, and companies can view applications for their jobs. 💻 Technologies Used Node.js: Backend runtime. Express.js: Web framework for building RESTful APIs. MongoDB: NoSQL database for data storage. Mongoose: ORM for MongoDB. JWT: JSON Web Tokens for authentication. Cloudinary: For handling resume uploads. Joi: For data validation. Multer: For file uploads. ⚙️ Installation Clone the repository: git clone https://github.com/Mohamed271162 Navigate to the project directory: cd job-search-app Install the dependencies: npm install Create a .env file and include the necessary environment variables (e.g., database URL, Cloudinary credentials, JWT secret).

Start the server: npm start

🔧 Usage 🧑‍💻 User APIs: Sign Up: Register a new user with email, mobile number, and password. Sign In: Login using email, recovery email, or mobile number. Update Account: Update user details like email, mobile number, and recovery email. Delete Account: Delete user account. Only the owner can delete their account. Get User Account Data: Retrieve the user’s own account details.

🏢 Company APIs: Add Company: Create a new company profile (for users with Company_HR role). Update Company: Update company details. Delete Company: Delete company profile. Get Company Data: Retrieve specific company data along with its jobs. Search Company: Search for a company by name. Get Job Applications: Retrieve job applications for a company’s job.

💼 Job APIs: Add Job: Create a new job listing (for users with Company_HR role). Update Job: Modify job details. Delete Job: Remove a job listing. Get All Jobs: List all available jobs with company information. Get Jobs by Company: Retrieve all jobs posted by a specific company. Filter Jobs: Apply filters like working time, job location, seniority level, and job title to search jobs. Apply to Job: Submit a job application, including technical and soft skills, and upload a resume in PDF format.

📄 Application APIs: Add Application: Apply for a job. Delete Application: Remove an existing application. Update Application: Update the application details.

📚 API Documentation Sign Up: POST /api/users/signup Sign In: POST /api/users/signin Add Company: POST /api/companies Add Job: POST /api/jobs Apply to Job: POST /api/applications For detailed documentation of all endpoints and request parameters, refer to the Postman documentation here.

🤝 Contributing Fork the repository. Create a new branch (git checkout -b feature-branch). Make your changes and commit (git commit -m 'Add feature'). Push to the branch (git push origin feature-branch). Open a pull request.
