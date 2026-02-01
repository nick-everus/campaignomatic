import React, { useState } from "react";

type GenerateResp = {
  id: string;
  copy: string;
  images: { square: string; landscape: string; portrait: string };
};

const DEFAULT_MARKETING =
  "Outdoor gear brand for hikers and backpackers. Focus on durability, adventure, and getting off the grid. Target audience: weekend trekkers and thru-hikers who want reliable, lightweight gear.";
const DEFAULT_IMAGE_PROMPT =
  "A hiker with a rugged backpack on a mountain trail at sunrise, mist in the valley below, professional outdoor photography, sharp focus, golden hour lighting";

export default function App() {
  const [marketingDescription, setMarketingDescription] = useState(DEFAULT_MARKETING);
  const [imagePrompt, setImagePrompt] = useState(DEFAULT_IMAGE_PROMPT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // In dev, talk to the API server directly so it works even if the Vite proxy doesn't
  const apiBase =
    (import.meta.env.VITE_API_URL as string) ||
    (import.meta.env.DEV ? "http://localhost:5174" : "");

  async function onGenerate() {
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const r = await fetch(`${apiBase}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketingDescription, imagePrompt }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || `Request failed: ${r.status}`);
      setResult(j);
    } catch (e: any) {
      const msg = String(e?.message || e);
      setErr(
        msg === "fetch failed" || msg.includes("Failed to fetch")
          ? "Backend not reachable. In one terminal run: cd campaignomatic && npm run dev:server. Then open http://localhost:5173 and try again."
          : msg
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1>Campaignomatic</h1>
      <p>Generate local-first marketing copy (Ollama) + ad images (Stable Diffusion).</p>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontWeight: 600 }}>Marketing description</div>
          <textarea value={marketingDescription} onChange={(e) => setMarketingDescription(e.target.value)} rows={3} style={{ width: "100%" }} />
        </label>

        <label>
          <div style={{ fontWeight: 600 }}>Brand image prompt</div>
          <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} rows={2} style={{ width: "100%" }} />
        </label>

        <button onClick={onGenerate} disabled={loading || !marketingDescription || !imagePrompt} style={{ padding: "10px 14px", fontWeight: 700 }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {err && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ccc" }}>
          <b>Error:</b> {err}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Preview</h2>
          <div style={{ padding: 12, border: "1px solid #ccc", marginBottom: 16, whiteSpace: "pre-wrap" }}>{result.copy}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <figure style={{ margin: 0 }}>
              <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>800×800</figcaption>
              <img src={result.images.square} style={{ width: "100%", maxWidth: 800, border: "1px solid #ddd" }} />
            </figure>

            <figure style={{ margin: 0 }}>
              <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>800×450</figcaption>
              <img src={result.images.landscape} style={{ width: "100%", maxWidth: 800, border: "1px solid #ddd" }} />
            </figure>

            <figure style={{ margin: 0 }}>
              <figcaption style={{ fontWeight: 600, marginBottom: 6 }}>450×800</figcaption>
              <img src={result.images.portrait} style={{ width: "100%", maxWidth: 450, border: "1px solid #ddd" }} />
            </figure>
          </div>
        </div>
      )}
    </div>
  );
}
