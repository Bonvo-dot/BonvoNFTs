const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const bodyParser = require("body-parser");
const { project_id } = require("./bonvo.json");
const { NFTStorage, File } = require("nft.storage");
const { API_KEY } = require("./nft-storage.json");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

const jsonParser = bodyParser.json();

const keyFilename = "bonvo.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  project_id,
  keyFilename,
});

const bucket = storage.bucket("bonvo-bucket"); // Get this from Google Cloud -> Storage

async function configureBucketCors(
  bucketName = "bonvo-bucket",
  maxAgeSeconds = 3600,
  method = "GET, POST, PUT, DELETE, HEAD",
  origin = "localhost:8080" &&
    "https://bonvo-front-cicd-r7ee2dy4ea-rj.a.run.app/#/" &&
    "localhost:3000",
  responseHeader = "content-type"
) {
  await bucket.setCorsConfiguration([
    {
      origin: [origin],
      responseHeader: [responseHeader],
      method: [method],
      maxAgeSeconds: maxAgeSeconds,
    },
  ]);

  console.log(`Bucket ${bucketName} was updated with a CORS config
        to allow ${method} requests from ${origin} sharing 
        ${responseHeader} responses across origins`);
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Gets all files in the defined bucket
app.get("/upload", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const lastUrl = files.slice(-1)[0].publicUrl();
    const response = {
      lastUrl,
      files: files.map((file) => file.publicUrl()),
    };
    res.send(response);
    console.log("Success");
  } catch (error) {
    console.log(error);
    res.send("Error:" + error);
  }
});

// Streams file upload to Google Storage
app.post("/upload_profile", multer.single("image"), (req, res) => {
  console.log("Made it /upload_profile");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        console.log("Success");
        res.status(200).send("Success");
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    console.log("Error:" + error);
    res.status(500).send(error);
  }
});

// Streams file upload to Google Storage
app.post("/upload", multer.single("images"), (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        console.log("Success");
        res.status(200).send("Success");
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    console.log("Error:" + error);
    res.status(500).send(error);
  }
});

app.post(
  "/nft-storage",
  multer.single("file"),
  jsonParser,
  async (req, res) => {
    const { name, description, attributes } = req.body;
    const client = new NFTStorage({ token: API_KEY });
    const metadata = await client
      .store({
        name,
        description,
        image: new File(
          [req.file.buffer],
          `image-${req.file.originalname}.png`
        ),
        attributes,
      })
      .then((metadata) => {
        console.log(metadata);
        res.send(metadata.url);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .send("Error: " + error + " Please check your NFT Storage API Key");
      });
  }
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server on port 8080 or as defined
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Configure the bucket CORS
configureBucketCors().catch(console.error);
