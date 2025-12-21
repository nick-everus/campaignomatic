from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.responses import Response
from diffusers import AutoPipelineForText2Image
import torch
import io
from PIL import Image

MODEL_ID = "stabilityai/sd-turbo"

app = FastAPI(title="Open Image Forge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=2000)
    negative_prompt: str = ""
    width: int = Field(default=1024, ge=256, le=4096)
    height: int = Field(default=1024, ge=256, le=4096)
    steps: int = Field(default=2, ge=1, le=50)
    guidance_scale: float = Field(default=0.0, ge=0.0, le=20.0)
    seed: int | None = None

pipe = None
device = None

def pick_device():
    if torch.backends.mps.is_available():
        return "mps"
    if torch.cuda.is_available():
        return "cuda"
    return "cpu"

@app.on_event("startup")
def startup():
    global pipe, device
    device = pick_device()
    dtype = torch.float16 if device in ("cuda", "mps") else torch.float32
    pipe = AutoPipelineForText2Image.from_pretrained(
        MODEL_ID,
        torch_dtype=dtype,
        variant="fp16" if dtype == torch.float16 else None,
    )
    pipe = pipe.to(device)

@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_ID, "device": device}

@app.post("/api/generate")
def generate(req: GenerateRequest):
    generator = None
    if req.seed is not None:
        generator = torch.Generator(device=device).manual_seed(req.seed)

    result = pipe(
        prompt=req.prompt,
        negative_prompt=req.negative_prompt or None,
        width=req.width,
        height=req.height,
        num_inference_steps=req.steps,
        guidance_scale=req.guidance_scale,
        generator=generator,
    )

    img: Image.Image = result.images[0]
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return Response(content=buf.getvalue(), media_type="image/png")
