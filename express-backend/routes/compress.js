const express = require('express');
const router = express.Router();
const multer = require('multer');
const { execFile } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const level = req.body.level || "screen";

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Validate compression level
    const allowedLevels = ["screen", "ebook", "printer", "prepress"];
    if (!allowedLevels.includes(level)) {
      return res.status(400).json({ error: "Invalid compression level" });
    }

    const tempDir = os.tmpdir();
    const inputPath = file.path;
    const outputPath = path.join(tempDir, `output-${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`);

    const gsCommand = process.platform === "win32" ? "gswin64c" : "gs";
    
    const compressPdf = () =>
      new Promise((resolve, reject) => {
        const args = [
          "-sDEVICE=pdfwrite",
          `-dCompatibilityLevel=1.4`,
          `-dPDFSETTINGS=/${level}`,
          "-dNOPAUSE",
          "-dQUIET",
          "-dBATCH",
          `-sOutputFile=${outputPath}`,
          inputPath
        ];

        execFile(gsCommand, args, (error, stdout, stderr) => {
          if (error) {
            console.error(`Ghostscript error:`, error);
            console.error(`Ghostscript stderr:`, stderr);
            reject(new Error("Ghostscript is not installed or failed to compress. Ensure Ghostscript is installed and in your PATH."));
          } else {
            resolve();
          }
        });
      });

    try {
      await compressPdf();
      
      const compressedBuffer = await fs.readFile(outputPath);
      
      await fs.unlink(inputPath).catch(console.error);
      await fs.unlink(outputPath).catch(console.error);

      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="compressed-${safeName}"`);
      return res.send(compressedBuffer);
    } catch (gsError) {
      await fs.unlink(inputPath).catch(console.error);
      return res.status(500).json({ error: gsError.message });
    }

  } catch (error) {
    console.error("Compression route error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
