import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const SD_WEBUI_URL = process.env.SD_WEBUI_URL || "http://127.0.0.1:7860";
const PORT = Number(process.env.PORT || 5174);
const ASSETS_DIR = process.env.ASSETS_DIR || "assets";

// Resolve assets from project root (campaignomatic/assets) so it works regardless of cwd
const assetsRoot = path.resolve(__dirname, "..", "..", ASSETS_DIR);
fs.mkdirSync(assetsRoot, { recursive: true });

app.use("/assets", express.static(assetsRoot));

app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    ollama: { baseUrl: OLLAMA_BASE_URL, model: OLLAMA_MODEL },
    stableDiffusion: { url: SD_WEBUI_URL },
    assetsDir: assetsRoot,
  });
});

const GenerateBody = z.object({
  marketingDescription: z.string().min(3),
  imagePrompt: z.string().min(3),
});

async function ollamaGenerateCopy(prompt: string): Promise<string> {
  const r = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Ollama error ${r.status}: ${t}`);
  }
  const j: any = await r.json();
  return (j.response || "").trim();
}

async function sdTxt2Img(prompt: string, width: number, height: number): Promise<string> {
  const r = await fetch(`${SD_WEBUI_URL}/sdapi/v1/txt2img`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, width, height, steps: 20 }),
  });
  if (!r.ok) {
    const t = await r.text();
    const hint =
      r.status === 404
        ? " Start WebUI with the API enabled: export COMMANDLINE_ARGS=\"--api --skip-torch-cuda-test\" then ./webui.sh"
        : "";
    throw new Error(`StableDiffusion error ${r.status}: ${t}${hint}`);
  }
  const j: any = await r.json();
  const b64 = j.images?.[0];
  if (!b64) throw new Error("StableDiffusion returned no images");
  return b64;
}

function hash16(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 16);
}

function writeBase64Png(filePath: string, b64: string) {
  const data = Buffer.from(b64, "base64");
  fs.writeFileSync(filePath, data);
}

app.post("/api/generate", async (req, res) => {
  const parsed = GenerateBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { marketingDescription, imagePrompt } = parsed.data;
  const id = hash16(`${Date.now()}-${marketingDescription}-${imagePrompt}`);
  const outDir = path.join(assetsRoot, id);
  const imgDir = path.join(outDir, "images");
  fs.mkdirSync(imgDir, { recursive: true });

  try {
    const copy = await ollamaGenerateCopy(
      `Write one concise marketing paragraph (3-5 sentences). Avoid bullets.\nCampaign: ${marketingDescription}`
    );

    const sizes: Array<[string, number, number]> = [
      ["800x800.png", 800, 800],
      ["800x450.png", 800, 450],
      ["450x800.png", 450, 800],
    ];

    const fullImgPrompt = `${imagePrompt}. Style: clean, modern, high-contrast, ad-ready. Campaign context: ${marketingDescription}`;

    for (const [name, w, h] of sizes) {
      const b64 = await sdTxt2Img(fullImgPrompt, w, h);
      writeBase64Png(path.join(imgDir, name), b64);
    }

    fs.writeFileSync(path.join(outDir, "copy.txt"), copy, "utf-8");
    fs.writeFileSync(
      path.join(outDir, "meta.json"),
      JSON.stringify({ id, marketingDescription, imagePrompt, createdAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );

    res.json({
      id,
      copy,
      images: {
        square: `/assets/${id}/images/800x800.png`,
        landscape: `/assets/${id}/images/800x450.png`,
        portrait: `/assets/${id}/images/450x800.png`,
      },
    });
  } catch (e: any) {
    res.status(502).json({ error: String(e?.message || e) });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
