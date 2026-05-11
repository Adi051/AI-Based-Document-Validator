const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { spawn } = require("child_process");

const User = require("../models/user");
const { generateHash } = require("../utils/hash");
const authmiddleware = require("../middelwares/authmiddleware");
const History = require("../models/historymodel");

const router = express.Router();

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});

const upload = multer({ storage });

// ================= OCR =================
function runOCR(filePath) {
  return new Promise((resolve) => {

    const fullPath = path.resolve(filePath);

    console.log("FILE PATH SENT TO PYTHON:", fullPath);

    const pythonProcess = spawn(
      "python",
      ["ocr-services/app.py", fullPath]
    );

    let data = "";
    let error = "";

    // ✅ STDOUT
    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    // ✅ STDERR
    pythonProcess.stderr.on("data", (err) => {
      error += err.toString();

      console.log("⚠️ OCR STDERR:", err.toString());
    });

    // ✅ PROCESS CLOSE
    pythonProcess.on("close", (code) => {

      console.log("PYTHON EXIT CODE:", code);

      if (error) {
        console.log("FINAL OCR ERROR:", error);
      }

      console.log("RAW OCR OUTPUT:", data);

      resolve(data.trim());
    });

  });
}

// ================= NORMALIZE =================
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\n/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectDocumentType(rawText) {
  const text = normalize(rawText);

  console.log(" DETECTION TEXT:", text.slice(0, 200));

  //  GOVT DOC
  if (
    //  Aadhaar signals
    /aadha?r/.test(text) ||
    text.includes("uidai") ||
    text.includes("unique identification authority") ||
    text.includes("government of india") ||
    text.includes("govt of india") ||
    text.includes("enrolment") ||
    /\d{4}\s?\d{4}\s?\d{4}/.test(text) || // Aadhaar number

    //  PAN CARD signals
    text.includes("income tax department") ||
    text.includes("permanent account number") ||
    text.includes("govt of india") ||
    text.includes("govemment of india") || // OCR typo
    /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(text) || // PAN format

    //  Common govt signals
    text.includes("government") ||
    text.includes("india") ||
    text.includes("signature") ||
    text.includes("dob") ||
    text.includes("male") ||
    text.includes("female")
  ) {
    console.log(" TYPE: GOVT DOC");
    return "govt_doc";
  }


  // 🎓 RESULT
  if (
    text.includes("university") ||
    text.includes("statement of marks") ||
    text.includes("marks") ||
    text.includes("semester") ||
    text.includes("sgpa") ||
    text.includes("cgpa")
  ) {
    console.log(" TYPE: RESULT");
    return "university result";
  }

  //  CERTIFICATE
  if (
    text.includes("certificate") ||
    text.includes("certif") ||
    text.includes("internship") ||
    text.includes("completion")
  ) {
    console.log(" TYPE: CERTIFICATE");
    return "certificate";
  }

  //  ASSIGNMENT
  if (
    text.includes("assignment") ||
    text.includes("experiment") ||
    text.includes("abstract") ||
    text.includes("report")||
    text.includes("tutorial no. ")||
    text.includes("bharati vidyapeeth")
  ) {
    console.log(" TYPE: ASSIGNMENT");
    return "assignment";
  }

  console.log(" TYPE: UNKNOWN");
  return "unknown";
}


function detectSubType(text) {

  text = normalize(text);

  // ================= AADHAAR =================

  const aadhaarKeywords = [
    "aadhaar",
    "aadhar",
    "uidai",
    "unique identification authority",
    "government of india",
    "enrolment",
    "enrollment",
    "dob",
    "male",
    "female"
  ];

  let aadhaarMatches = 0;

  aadhaarKeywords.forEach((k) => {
    if (text.includes(k)) {
      aadhaarMatches++;
    }
  });

  // 🔥 flexible aadhaar regex
  const aadhaarRegex =
    /\d{4}\s?\d{4}\s?\d{4}/;

  if (
    aadhaarMatches >= 3 ||
    aadhaarRegex.test(text)
  ) {
    return "aadhaar";
  }

  // ================= PAN =================

  const panRegex =
    /[A-Z]{5}[0-9]{4}[A-Z]/;

  if (
    text.includes("income tax department") ||
    text.includes("permanent account number") ||
    panRegex.test(text)
  ) {
    return "pan";
  }

  return "unknown";
}
// ================= KEYWORD CHECK =================
function checkKeywords(text, keywords) {
  text = normalize(text);
  let found = 0;

  keywords.forEach((word) => {
    if (text.includes(word)) found++;
  });

  return (found / keywords.length) * 100;
}

// ================= PRN =================
function extractPRN(text) {
  return text.match(/\b\d{8,12}\b/)?.[0] || null;
}

// ================= PLAGIARISM =================
function plagiarismScore(a, b) {
  if (!a || !b) return 0;

  a = normalize(a);
  b = normalize(b);

  const wordsA = new Set(a.split(" ").filter(w => w.length > 3));
  const wordsB = new Set(b.split(" ").filter(w => w.length > 3));

  let match = 0;

  for (let w of wordsA) {
    if (wordsB.has(w)) {
      match++;
    }
  }

  //  Jaccard similarity
  const total = new Set([...wordsA, ...wordsB]).size;

  return Math.round((match / total) * 100);
}

// ================= NORMALIZE GOVT TEXT =================

function normalizeGovtText(text = "") {

  return text
    .toLowerCase()

    // remove aadhaar numbers
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, " ")

    // remove mobile numbers
    .replace(/\b\d{10}\b/g, " ")

    // remove enrollment numbers
    .replace(/\d{4}\/\d{5}\/\d{5}/g, " ")

    // remove DOB
    .replace(/\d{2}\/\d{2}\/\d{4}/g, " ")

    // remove names (simple)
    .replace(/[A-Z][a-z]+\s[A-Z][a-z]+/g, " ")

    // remove symbols
    .replace(/[^a-z0-9 ]/g, " ")

    // remove extra spaces
    .replace(/\s+/g, " ")

    .trim();
}



// ================= MAIN ROUTE =================
router.post("/file", authmiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;

    //  HASH
    const uploadedHash = generateHash(filePath);

    //  OCR
    let  rawText = await runOCR(filePath);
    console.log("RAW OCR OUTPUT:", rawText);

// 🔥 OCR FAILED HANDLER
if (
  !rawText ||
  rawText.trim() === "" ||
  rawText.includes("OCR_FAILED")
) {
  console.log("⚠️ OCR failed completely");

  return res.json({
    success: false,
    status: "Unable to Analyze",
    score: 0,
    message: "OCR could not read this document. Try a clearer PDF/image."
  });
}

    const documentType = detectDocumentType(rawText);

    const subType = detectSubType(rawText);

        console.log(" SUBTYPE:", subType);

    console.log(" FINAL TYPE:", documentType);

    


    

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("👤 ROLE:", req.user.role);

    // ================= ADMIN =================
   

   
    // ================= SIMILARITY =================
let plagiarism = 0;
let matchedDoc = null;

let allDocs = [];

if (documentType === "govt_doc") {
  
  allDocs = await History.find({
    documentType,
    subType,
    isOriginal: true,
  });
} else {
  
  allDocs = await History.find({
    documentType,
    isOriginal: true,
  });
}

console.log("📊 QUERY TYPE:", documentType);
console.log("📊 QUERY SUBTYPE:", subType);
console.log("📊 FOUND DOCS:", allDocs.length);
console.log("📄 OCR TEXT:", rawText.slice(0, 200));
console.log("📄 DB TEXT:", allDocs[0]?.documentText?.slice(0, 200));


    // ================= MULTI FACTOR ENGINE =================
    let score = 0;
     let redFlags = 0;

    const checks = {
      structure: 0,
      similarity: 0,
      prnMatch: false,
      hashMatch: false,
      motherName: false,
      signature: false,
    };

    // =================  PLAGIARISM LOOP =================
for (let doc of allDocs) {

  if (!doc.documentText) continue;

  let compareOCR = rawText;
  let compareDB = doc.documentText;

  // 🔥 Govt docs = structure compare only
  if (documentType === "govt_doc") {

    compareOCR =
      normalizeGovtText(rawText);

    compareDB =
      normalizeGovtText(doc.documentText);
  }

  const scoreVal =
    plagiarismScore(compareOCR, compareDB);

  if (scoreVal > plagiarism) {

    plagiarism = scoreVal;

    matchedDoc = doc;
  }
}

checks.similarity = plagiarism;
    //  1. STRUCTURE CHECK
    

// ================= TYPE BASED LOGIC (FINAL GOVT ENGINE PRO) =================

if (documentType === "govt_doc") {

  const text = rawText.toLowerCase();
  const cleanText =
  rawText
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

  let govtScore = 0;
 

  let aadhaarDetected = false;
  let panDetected = false;

  // =================  1. AADHAAR (STRONG FIX) =================

 // ================= AADHAAR EXTRACTION =================

let aadhaarNumber = null;

// 🔥 normal aadhaar format
const directMatch =
  rawText.match(/\d{4}\s?\d{4}\s?\d{4}/);

if (directMatch) {

  aadhaarNumber = directMatch[0];

} else {

  // 🔥 OCR noisy cleanup
  let cleaned = rawText
    .replace(/O/g, "0")
    .replace(/I/g, "1")
    .replace(/l/g, "1")
    .replace(/A/g, "4")
    .replace(/S/g, "5")
    .replace(/B/g, "8");

  // keep only alphanumeric + spaces
  cleaned = cleaned.replace(/[^a-zA-Z0-9 ]/g, " ");

  // extract possible digit groups
  const possible = cleaned.match(/[0-9A-Z]{12,14}/g) || [];

  for (let p of possible) {

    // keep only digits
    let digits = p.replace(/\D/g, "");

    if (digits.length === 12) {

      aadhaarNumber =
        digits.replace(
          /(\d{4})(\d{4})(\d{4})/,
          "$1 $2 $3"
        );

      break;
    }
  }
}

  if (aadhaarNumber) {
  govtScore += 60;
  aadhaarDetected = true;

  const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');

  checks.aadhaarNumber = cleanAadhaar;
  checks.aadhaarPattern = true;


  
}
  // VID (optional boost)
  if (/\d{4}\s\d{4}\s\d{4}\s\d{4}/.test(text)) {
    govtScore += 10;
  }

  const aadhaarKeywords = [
    "aadhaar",
    "aadhar",
    "uidai",
    "unique identification authority",
    "government of india",
    "enrolment",
    "vid",
    "qr code",
    "male",
    "female",
    "dob",
    "year of birth",
    "address"
  ];

  const aadhaarScore = checkKeywords(text, aadhaarKeywords);
  govtScore += aadhaarScore * 0.2;

  // =================  2. PAN =================

  const panMatch = cleanText.match(/[A-Z]{5}[0-9]{4}[A-Z]/);

  if (panMatch) {
    govtScore += 50;
    panDetected = true;

    checks.panNumber = panMatch[0];
    checks.panPattern = true;

    if (/[A-Z]{3,}\s[A-Z]{3,}/.test(rawText)) {
      govtScore += 10;
      checks.nameDetected = true;
    }

    if (text.includes("father")) govtScore += 5;

    if (/\d{2}\/\d{2}\/\d{4}/.test(rawText)) {
      govtScore += 5;
      checks.dobDetected = true;
    }
  }

  const panKeywords = [
    "income tax department",
    "permanent account number",
    "govt of india",
    "government of india",
    "pan card"
  ];

  govtScore += checkKeywords(text, panKeywords) * 0.2;

  // =================  3. COMMON =================

  const govtKeywords = [
    "government of india",
    "govt of india",
    "india",
    "signature",
    "address"
  ];

  govtScore += checkKeywords(text, govtKeywords) * 0.2;

  // OCR typo fix
  if (
    text.includes("govemment of india") ||
    text.includes("goverment of india")
  ) {
    govtScore += 10;
  }

  // =================  4. STRUCTURE BONUS =================
  if (aadhaarDetected || panDetected) {
    govtScore += 10;
  }
  // ================= DB MATCH BONUS =================

if (plagiarism >= 45) {

  govtScore += 25;

  checks.databaseMatch = true;
}

if (plagiarism < 25) {

  redFlags++;

  govtScore -= 15;

  checks.noDatabaseMatch = true;
}

   // ================= 🚨 FAKE DETECTION ENGINE =================



//  Aadhaar missing
if (!aadhaarDetected) {
  redFlags++;
  checks.noAadhaar = true;
}

//  Aadhaar invalid length
if (checks.aadhaarNumber) {
  const clean = checks.aadhaarNumber;

  if (clean.length !== 12) {
    redFlags++;
    govtScore -= 30;
    checks.invalidAadhaar = true;
  }
}

//  Weak govt structure
const strongGovtKeywords = [
  "government of india",
  "unique identification authority"
];

const strongMatch = checkKeywords(text, strongGovtKeywords);

if (strongMatch < 50) {

  redFlags++;

  govtScore -= 15;

  checks.structureFail = true;
}

//  OCR weak
if (rawText.length < 40) {
  redFlags++;
  govtScore -= 20;
  checks.lowText = true;
}

//  Missing gender
if (!text.includes("male") && !text.includes("female")) {
  redFlags++;
  govtScore -= 10;
  checks.genderMissing = true;
}

//  Missing DOB
if (!text.includes("dob") && !text.includes("year of birth")) {
  redFlags++;
  govtScore -= 10;
  checks.dobMissing = true;
}

//  No DB match


  
  // =================  FINAL =================
  //  FINAL SCORE FIX (IMPORTANT)
score = Math.min(Math.max(govtScore, 0), 100);

// d UI CLEAN CONFIDENCE
checks.structure = Math.min(Math.round(govtScore), 100) + "% govt confidence";
} else {

  const text = rawText.toLowerCase();

  let resultScore = 0;

  
 

  // =================  KEYWORDS =================
  const structureKeywords = [
    "university",
    "marks",
    "semester",
    "result",
    "certificate",
    "cgpa",
    "sgpa",
    "statement of marks",
    "seat no",
    "prn"
  ];

  const structureScore = checkKeywords(text, structureKeywords);
  resultScore += structureScore * 0.5;

  // ================= 🎓 PRN VALIDATION =================

const prnMatch = rawText.match(/\b\d{6,12}\b/);

if (prnMatch) {
  const prn = prnMatch[0];

  checks.detectedPRN = prn;

  if (prn.length === 10) {
    resultScore += 15;
    checks.prnValid = true;
  } else {
    redFlags++;
    resultScore -= 20;
    checks.prnInvalidLength = true;
  }
} else {
  redFlags++;
  resultScore -= 25;
  checks.noPRN = true;
}
  

  // =================  STRUCTURE =================
  if (text.includes("university")) resultScore += 15;
  if (text.includes("semester")) resultScore += 10;
  if (text.includes("marks")) resultScore += 10;

  // =================  PRESENCE CHECK =================
  if (/\b\d{8,12}\b/.test(text)) {
    resultScore += 10;
    checks.prnPresent = true;
  }

  // ================= 👩 MOTHER NAME =================

if (
  text.includes("mother") ||
  text.includes("mother name") ||
  text.includes("mother's name")
) {
  resultScore += 10;
  checks.motherName = true;
} else {
  redFlags++;
  resultScore -= 10;
  checks.motherNameMissing = true;
}
  // =================  SIGNATURE =================
  const signKeywords = ["controller of examination", "director", "registrar"];
  const signScore = checkKeywords(text, signKeywords);

  if (signScore > 30) {
    resultScore += 10;
    checks.signature = true;
  }

  // =================  DB MATCH (BONUS ONLY) =================
 // ================= FINAL SMART SCORING =================

const structureWeight = 0.7;
const plagiarismWeight = 0.3;

// ================= 🚨 RESULT FAKE DETECTION =================



// ❌ No University
if (!text.includes("university")) {
  redFlags++;
  resultScore -= 25;
  checks.noUniversity = true;
}

// ❌ No Marks / CGPA / SGPA
if (
  !text.includes("marks") &&
  !text.includes("cgpa") &&
  !text.includes("sgpa")
) {
  redFlags++;
  resultScore -= 25;
  checks.noMarks = true;
}

// ❌ No Semester
if (!text.includes("semester")) {
  redFlags++;
  resultScore -= 10;
  checks.noSemester = true;
}

// ❌ OCR weak (fake / blur)
if (rawText.length < 100) {
  redFlags++;
  resultScore -= 20;
  checks.lowText = true;
}






//  weighted score
score = (resultScore * structureWeight) + (plagiarism * plagiarismWeight);

//  DB / similarity check (merged clean)
if (!matchedDoc || plagiarism < 30) {
  redFlags++;
  resultScore -= 25;
  checks.noDatabaseMatch = true;
}

//  small bonus / penalty (optional but powerful)
if (plagiarism > 80) score += 5;
if (plagiarism < 20) score -= 5;

//  clamp
score = Math.min(score, 100);
score = Math.max(score, 0);

//  UI data
checks.structure = Math.round(resultScore) + "% result confidence";
checks.similarity = plagiarism + "%";

}


// ================= FINAL DECISION =================

let status = "Fake";

if (documentType === "govt_doc") {

  // 🔥 Aadhaar/PAN structure strong
  if (
    score >= 60 &&
    (
      checks.aadhaarNumber ||
      checks.panNumber
    )
  ) {

    status = "Authentic";
  }

  // medium confidence
  else if (score >= 40) {

    status = "Suspicious";
  }

  else {

    status = "Fake";
  }

} else {

  // 🎓 results/certificates stricter

  if (redFlags >= 2) {

    status = "Fake";
    score = Math.min(score, 40);

  } else if (score >= 70) {

    status = "Authentic";

  } else if (score >= 40) {

    status = "Suspicious";

  } else {

    status = "Fake";
  }
}
if (
  matchedDoc &&
  matchedDoc.isOriginal &&
  plagiarism >= 70 &&
  redFlags <= 1
) {
  status = "Authentic";
  score = Math.max(score, 85);
  checks.originalVerified = true;
}

console.log("🚨 FINAL RED FLAGS:", redFlags);
console.log("📊 FINAL SCORE:", score);

    // ================= SAVE =================
   let isOriginal = false;

if (
  req.user.role?.toLowerCase() === "super admin"
) {
  isOriginal = true;
}

await History.create({
  fileName: req.file.filename,
  image: req.file.path,
  documentType,
  subType,
  documentText: rawText,
  documentHash: uploadedHash,
  isOriginal,
  uploadedBy: req.user._id,
});
// BEFORE RESPONSE (res.json se pehle)
const uploadedPRN = extractPRN(rawText);
    // ================= RESPONSE =================
    res.json({
      success: true,
      fileName: req.file.filename,
        documentType,

      score: Math.round(score),
      status,

      plagiarismScore: plagiarism,
      matchedWith: matchedDoc?._id || null,

      extractedPRN: uploadedPRN,

      // 🔥 EXPLAINABLE AI 🔥
     checks: {
  structure: checks.structure,
  similarity: checks.similarity,
  aadhaarNumber: checks.aadhaarNumber, // 🔥 ADD THIS
  prnMatch: checks.prnMatch,
  hashMatch: checks.hashMatch,
  motherName: checks.motherName,
  signature: checks.signature,
}
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;