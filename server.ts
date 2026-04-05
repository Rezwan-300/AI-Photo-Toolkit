import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";

const app = express();
const PORT = 3000;
const SETTINGS_FILE = path.join(process.cwd(), "settings.json");

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Helper to read settings
const getSettings = () => {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  } catch (e) {
    return {};
  }
};

// Helper to save settings
const saveSettings = (settings: any) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

// API: Get Ad Settings
app.get("/api/settings", (req, res) => {
  const settings = getSettings();
  const { admin_password, ...publicSettings } = settings;
  res.json(publicSettings);
});

// API: Update Settings (Admin)
app.post("/api/settings", (req, res) => {
  const { password, settings } = req.body;
  const currentSettings = getSettings();
  
  if (password !== currentSettings.admin_password) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const updatedSettings = { ...currentSettings, ...settings };
  saveSettings(updatedSettings);
  res.json({ success: true });
});

// API: Image Processing
app.post("/api/process", upload.fields([{ name: "image", maxCount: 1 }, { name: "mask", maxCount: 1 }]), async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageFile = files?.image?.[0];
  const maskFile = files?.mask?.[0];

  if (!imageFile) return res.status(400).json({ error: "No image uploaded" });
  
  const { tool, options } = req.body;
  const parsedOptions = JSON.parse(options || "{}");
  let pipeline = sharp(imageFile.buffer);

  try {
    switch (tool) {
      case "enhance":
        pipeline = pipeline.sharpen().modulate({ brightness: 1.1, saturation: 1.1 });
        break;
      
      case "compress":
        const quality = parseInt(parsedOptions.quality) || 80;
        pipeline = pipeline.jpeg({ quality });
        break;
      
      case "passport":
        const { width, height, bgColor } = parsedOptions;
        // Resize and add background if needed
        pipeline = pipeline.resize(width, height, { fit: "cover" });
        if (bgColor && bgColor !== 'transparent') {
          pipeline = pipeline.flatten({ background: bgColor });
        }
        break;
      
      case "convert":
        const format = parsedOptions.format || "webp";
        if (format === "png") pipeline = pipeline.png();
        else if (format === "webp") pipeline = pipeline.webp();
        else pipeline = pipeline.jpeg();
        break;

      case "colorize":
        pipeline = pipeline.modulate({ saturation: 1.2, brightness: 1.05 }).tint({ r: 255, g: 240, b: 220 });
        break;

      case "remove":
        if (maskFile) {
          // A very basic "removal" by blurring the masked area
          // In a real app, you'd use a GAN or similar
          const blurred = await sharp(imageFile.buffer).blur(20).toBuffer();
          pipeline = pipeline.composite([{
            input: blurred,
            blend: 'over',
            // Note: sharp doesn't easily support using a separate buffer as an alpha mask in composite
            // without more complex steps. We'll just return a slightly modified version for now.
          }]);
        }
        pipeline = pipeline.sharpen();
        break;

      default:
        break;
    }

    const buffer = await pipeline.toBuffer();
    const base64 = `data:image/${parsedOptions.format || "jpeg"};base64,${buffer.toString("base64")}`;
    res.json({ image: base64, size: buffer.length });
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Processing failed" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
