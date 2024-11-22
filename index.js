const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage });

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const parseBase64File = (file_b64) => {
  try {
    const buffer = Buffer.from(file_b64, "base64");
    return {
      isValid: true,
      mimeType: "application/octet-stream", 
      sizeKB: (buffer.length / 1024).toFixed(2),
    };
  } catch {
    return { isValid: false, mimeType: null, sizeKB: 0 };
  }
};

app.post("/bfhl", upload.none(), (req, res) => {
  const { data, file_b64 } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid data format" });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
  const lowercaseAlphabets = alphabets.filter((item) => /^[a-z]$/.test(item));
  const highestLowercase = lowercaseAlphabets.sort().slice(-1)[0] || null;
  const primeFound = numbers.some((num) => isPrime(Number(num)));

  let fileInfo = { isValid: false, mimeType: null, sizeKB: 0 };
  if (file_b64) {
    fileInfo = parseBase64File(file_b64);
  }

  res.json({
    is_success: true,
    user_id: "Harshit_galphat_01122004", 
    email: "galphatharsh@gmail.com",
    roll_number: "0002CB211022",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: primeFound,
    file_valid: fileInfo.isValid,
    file_mime_type: fileInfo.mimeType,
    file_size_kb: fileInfo.sizeKB,
  });
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
