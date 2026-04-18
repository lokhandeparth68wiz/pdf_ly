const express = require('express');
const router = express.Router();
const multer = require('multer');
const { execFile } = require("child_process");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const os = require("os");

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const targetFormat = req.body.targetFormat;
    
    if (!file || !targetFormat) {
      return res.status(400).json({ error: "Missing file or targetFormat" });
    }

    // Validate targetFormat to prevent injection
    const allowedFormats = ["pdf", "docx", "doc"];
    if (!allowedFormats.includes(targetFormat)) {
      return res.status(400).json({ error: "Invalid target format" });
    }

    const ext = path.extname(file.originalname);
    const tempDir = os.tmpdir();
    
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tempDir, `input-${uniqueId}${ext}`);
    const outdir = tempDir;

    await fs.rename(file.path, inputPath);

    let loCommand = "libreoffice";
    if (process.platform === "win32") {
      const defaultWinPath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
      loCommand = fsSync.existsSync(defaultWinPath) ? defaultWinPath : "soffice";
    }

    const convertFile = () =>
      new Promise((resolve, reject) => {
        let args = ["--headless", "--convert-to", targetFormat, "--outdir", outdir, inputPath];
        
        if (ext.toLowerCase() === ".pdf" && targetFormat === "docx") {
          args = ["--headless", "--infilter=writer_pdf_import", "--convert-to", "docx", "--outdir", outdir, inputPath];
        }

        execFile(loCommand, args, { env: { ...process.env, HOME: os.tmpdir() } }, async (error, stdout, stderr) => {
          if (error) {
             console.error(`LibreOffice error:`, error);
             console.error(`LibreOffice stderr:`, stderr);
             reject(new Error("LibreOffice conversion failed. Ensure it is installed and in PATH."));
          } else {
             const parsedInput = path.parse(inputPath);
             const outputPath = path.join(outdir, `${parsedInput.name}.${targetFormat}`);
             
             try {
                await fs.access(outputPath);
                resolve(outputPath);
             } catch (e) {
                console.error("LibreOffice succeeded but output file is missing.");
                console.error("stdout:", stdout);
                console.error("stderr:", stderr);
                reject(new Error(`LibreOffice failed to generate ${targetFormat}. Log: ${stdout} ${stderr}`));
             }
          }
        });
      });

    try {
      const outputPath = await convertFile();
      const convertedBuffer = await fs.readFile(outputPath);
      
      await fs.unlink(inputPath).catch(console.error);
      await fs.unlink(outputPath).catch(console.error);

      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      res.setHeader('Content-Type', targetFormat === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader('Content-Disposition', `attachment; filename="converted-${safeName.replace(ext, `.${targetFormat}`)}"`);
      return res.send(convertedBuffer);
      
    } catch (loError) {
      await fs.unlink(inputPath).catch(console.error);
      return res.status(500).json({ error: loError.message });
    }

  } catch (error) {
    console.error("Conversion route error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
