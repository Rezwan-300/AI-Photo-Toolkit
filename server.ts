import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const ADS_CONFIG_FILE = path.join(process.cwd(), "ads_config.json");

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Helper to read ads config
const getAdsConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(ADS_CONFIG_FILE, "utf-8"));
  } catch (e) {
    return {};
  }
};

// Helper to save ads config
const saveAdsConfig = (config: any) => {
  fs.writeFileSync(ADS_CONFIG_FILE, JSON.stringify(config, null, 2));
};

// API: Get Ads Config
app.get("/api/ads", (req, res) => {
  res.json(getAdsConfig());
});

// API: Get User (Empty since auth is removed)
app.get("/api/user", (req, res) => {
  res.json(null);
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
        // Simulated AI Enhancement: Sharpen, increase contrast, and slight brightness boost
        pipeline = pipeline
          .sharpen(1.5, 0.5, 0.2)
          .modulate({ brightness: 1.05, saturation: 1.1 })
          .gamma(1.1);
        break;
      
      case "compress":
        const quality = Math.min(Math.max(parseInt(parsedOptions.quality) || 80, 1), 100);
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      
      case "passport":
        const { type, bgColor } = parsedOptions;
        // 2x2 inch at 300dpi = 600x600px
        // 35x45mm at 300dpi = 413x531px
        const targetWidth = type === '2x2' ? 600 : 413;
        const targetHeight = type === '2x2' ? 600 : 531;
        
        pipeline = pipeline.resize(targetWidth, targetHeight, { 
          fit: "cover",
          position: "top" // Usually better for portraits
        });

        if (bgColor && bgColor !== 'original') {
          // Note: Real background removal requires a model. 
          // We'll simulate by flattening if there's transparency or just tinting
          pipeline = pipeline.flatten({ background: bgColor });
        }
        break;
      
      case "convert":
        const format = parsedOptions.format || "webp";
        if (format === "png") pipeline = pipeline.png();
        else if (format === "webp") pipeline = pipeline.webp({ quality: 90 });
        else pipeline = pipeline.jpeg({ quality: 90 });
        break;

      case "colorize":
        // Simulated colorization: Increase saturation and apply a subtle multi-tone tint
        pipeline = pipeline
          .modulate({ saturation: 1.4, brightness: 1.02 })
          .tint({ r: 255, g: 245, b: 230 }); // Warm base
        break;

      case "remove":
        if (maskFile) {
          // Simulated Inpainting: Blur the masked area and composite
          const blurred = await sharp(imageFile.buffer)
            .blur(30)
            .modulate({ brightness: 0.9 })
            .toBuffer();
          
          pipeline = pipeline.composite([{
            input: blurred,
            blend: 'over',
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
