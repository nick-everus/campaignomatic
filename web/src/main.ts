type ResPreset = { label: string; w: number; h: number };

const presets: ResPreset[] = [
  { label: "1024×1024 (Square)", w: 1024, h: 1024 },
  { label: "1280×720 (720p)", w: 1280, h: 720 },
  { label: "1920×1080 (1080p)", w: 1920, h: 1080 },
  { label: "2560×1440 (1440p)", w: 2560, h: 1440 },
  { label: "3440×1440 (Ultrawide)", w: 3440, h: 1440 },
  { label: "3840×2160 (4K)", w: 3840, h: 2160 }
];

const API = "http://127.0.0.1:8001/api/generate";

const app = document.getElementById("app")!;

app.innerHTML = `
  <h1>Open Image Forge</h1>
  <textarea id="prompt" placeholder="Describe the image..."></textarea>
  <select id="res"></select>
  <button id="go">Generate</button>
  <img id="out" />
`;

const resEl = document.getElementById("res") as HTMLSelectElement;
for (const p of presets) {
  const o = document.createElement("option");
  o.value = JSON.stringify(p);
  o.textContent = p.label;
  resEl.appendChild(o);
}

document.getElementById("go")!.addEventListener("click", async () => {
  const prompt = (document.getElementById("prompt") as HTMLTextAreaElement).value;
  const { w, h } = JSON.parse(resEl.value);
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, width: w, height: h })
  });
  const blob = await res.blob();
  (document.getElementById("out") as HTMLImageElement).src = URL.createObjectURL(blob);
});
