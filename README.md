# NestJS-Prisma-Cloudinary-Multer
This project is a robust backend application built with the NestJS framework, designed to handle file uploads, process them with Multer, and store them in Cloudinary, with metadata saved to a PostgreSQL database via Prisma ORM.


🚀 Features
NestJS: A powerful, TypeScript-based framework for server-side applications.

Multer: Middleware for handling multipart/form-data, used to parse incoming file uploads.

Cloudinary: A cloud-based service for managing and delivering images. The application uploads files to Cloudinary for scalable and secure storage.

Prisma ORM: A modern, type-safe database toolkit used to persist file metadata (URL, public ID) in a database.

PostgreSQL: A reliable and feature-rich relational database.

Promises & Async/Await: The application uses modern JavaScript syntax to handle asynchronous operations gracefully.

File System (fs) Management: Ensures temporary files are deleted from the server after they are uploaded to Cloudinary, preventing disk space usage.

📦 Prerequisites
Ensure you have the following installed on your system:

Node.js (LTS version)

npm or yarn

Docker & Docker Compose (for running the database)

🏁 Getting Started
Follow these steps to set up and run the project locally.

Clone the repository:

git clone [git@github.com:timaZhuk/NestJS-Prisma-Cloudinary-Multer.git](git@github.com:timaZhuk/NestJS-Prisma-Cloudinary-Multer.git)
cd your-project


Set up environment variables: Create a .env file in the project root with the following variables.

DATABASE_URL="postgresql://user:password@localhost:5432/your_database?schema=public"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"


Note: You must create a free account on Cloudinary to obtain your API credentials. This file should be added to .gitignore to prevent it from being committed.

Start the database container: Using Docker Compose, start the PostgreSQL database.

docker-compose up -d


Install dependencies:

npm install


Initialize Prisma and run migrations: This command creates the necessary tables in your database for storing file metadata.

npx prisma migrate dev --name add_file_model


Run the application:

npm run start:dev


The application will be running at http://localhost:3000.

📂 File Upload Architecture
The file upload process is designed for reliability and efficiency, using the following flow:

Request Reception: The FileUploadController receives a POST request at the /file-upload endpoint.

Temporary Storage: The @UseInterceptors(FileInterceptor('file')) decorator, powered by Multer, intercepts the request. It extracts the file from the file field and saves it to a temporary ./uploads folder on the local server with a unique filename.

Cloudinary Upload: The FileUploadService receives the temporary file path. It then uses the Cloudinary SDK to upload the file from the local disk to your Cloudinary cloud. This process is handled asynchronously with Promises.

Database Persistence: Upon a successful upload to Cloudinary, the service retrieves the file's public URL and unique public ID from the Cloudinary response. It then uses Prisma to save this metadata to the database.

Local Cleanup: After the file metadata is saved, the application deletes the temporary file from the local ./uploads directory to free up disk space.

Error Handling: A try/catch block ensures that if any step fails (e.g., upload to Cloudinary or database write), the temporary file is immediately removed from the server, preventing orphan files.
