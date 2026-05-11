const crypto = require("crypto");
const fs = require("fs");

// 🔥 FILE HASH (SHA256)
function generateHash(filePath) {
try {
const fileBuffer = fs.readFileSync(filePath);
return crypto.createHash("sha256").update(fileBuffer).digest("hex");
} catch (err) {
console.error("Hash error:", err.message);
return null;
}
}

// 🔥 TEXT HASH (FOR OCR CONTENT)
function generateTextHash(text) {
try {
return crypto.createHash("sha256").update(text).digest("hex");
} catch (err) {
console.error("Text hash error:", err.message);
return null;
}
}

module.exports = { generateHash, generateTextHash };
