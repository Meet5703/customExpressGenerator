const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Function to create directories recursively
const mkdirRecursive = (dirPath) => {
  const parentDir = path.dirname(dirPath);
  if (!fs.existsSync(parentDir)) {
    mkdirRecursive(parentDir);
  }
  fs.mkdirSync(dirPath);
};

// Function to create a file with boilerplate code
const createFile = (filePath, boilerplate = "") => {
  fs.writeFileSync(filePath, boilerplate, { flag: "wx" });
};

// Function to create directory and file structure
const createDirectoryStructure = (targetDir, directories, files) => {
  directories.forEach((dir) => {
    const dirPath = path.join(targetDir, dir);
    mkdirRecursive(dirPath);
  });

  files.forEach((file) => {
    const filePath = path.join(targetDir, file);
    // Check if the file already exists
    if (!fs.existsSync(filePath)) {
      // If file does not exist, create it with boilerplate code
      const boilerplate = getBoilerplate(file); // Get boilerplate code based on file name
      createFile(filePath, boilerplate);
    }
  });
};

// Function to get boilerplate code based on file name
const getBoilerplate = (fileName) => {
  switch (fileName) {
    case "index.js":
      return `const express = require("express");
      const path = require("path");
      const connectDB = require("./models/database/dbconnect");
      const app = express();
      const port = 3000;
      
      // Database connection
      connectDB();
      // Middleware
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(express.static(path.join(__dirname, "public")));
      
      //ejs
      app.set("view engine", "ejs");
      
      // Routes
      
      app.use(require("./routes/api"));
      
      app.listen(port, () => {
        console.log("Server is running on port", port);
      });
      `;
    case "views/index.ejs":
      return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"></script>
        </head>
        <body>
          <h1>Hello</h1>
        </body>
      </html>
      `;
    case "public/stylesheets/style.css":
      return `*{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }`;
    case "public/javascript/script.js":
      return `console.log("Hello World!");`;
    case "models/database/dbconnect.js":
      return `const mongoose = require("mongoose");
          const dotenv = require("dotenv");
          
          // Load environment variables from .env file
          dotenv.config();
          
          const connectDB = async () => {
            try {
              const conn = await mongoose.connect(process.env.MONGODB_URI);
              console.log("MongoDB Connected: conn.connection.host");
            } catch (error) {
              console.error(error);
              process.exit(1);
            }
          };
          
          module.exports = connectDB;`;
    case "models/schemas/schema.js":
      return `const mongoose = require("mongoose");

            const userSchema = new mongoose.Schema({
              name: {
                type: String,
                required: true,
              },
              email: {
                type: String,
                required: true,
              },
              password: {
                type: String,
                required: true,
              },
            });
            
            module.exports = mongoose.model("User", userSchema);
`;

    case "routes/api.js":
      return `const express = require("express");
  const router = express.Router();
  
  router.get("/", (req, res) => {
    res.render("index");
  });
  
  module.exports = router;
  `;
    case ".env":
      return `MONGODB_URI = mongodb+srv://MeetKhetani:mvmmeet@cluster0.4v0ez0b.mongodb.net/Backend?retryWrites=true&w=majority`;
    default:
      return ""; // Default empty boilerplate for unknown files
  }
};

// Define directory structure
const directories = [
  "public",
  "public/javascript",
  "public/stylesheets",
  "public/images",
  "views",
  "routes",
  "models",
  "models/database",
  "models/schemas",
];

// Define files to be created
const files = [
  "index.js",
  "views/index.ejs",
  "public/stylesheets/style.css",
  "public/javascript/script.js",
  "models/database/dbconnect.js",
  "models/schemas/schema.js",
  "routes/api.js",
  ".env",
];

// Get target directory from command line argument
const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Please provide a target directory.");
  process.exit(1);
}

// Create directory structure and files
createDirectoryStructure(targetDir, directories, files);

console.log("Express boilerplate generated.");

// Run npm init and npm install
console.log("Initializing npm...");
execSync("npm init -y", { cwd: targetDir, stdio: "inherit" });
console.log("Installing npm packages...");
execSync("npm install express mongoose dotenv ejs", {
  cwd: targetDir,
  stdio: "inherit",
});
console.log("npm packages installed.");
