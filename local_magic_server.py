import torch
from diffusers import AutoPipelineForText2Image
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image
import uvicorn
import os

app = FastAPI(title="Spark Local Magic Brain")

# --- 🪄 CONFIG ---
# We use SDXL Turbo because it's high quality and only needs 1 step!
# This makes it near-instant on an RTX 4060 Ti.
MODEL_ID = "stabilityai/sdxl-turbo"

print("Loading Local Magic Brain... (This may take a moment on first run)")
try:
    # Use GPU if available, otherwise CPU
    device = "cuda" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if device == "cuda" else torch.float32

    # Initialize the pipeline
    pipe = AutoPipelineForText2Image.from_pretrained(
        MODEL_ID, 
        torch_dtype=torch_dtype, 
        variant="fp16" if device == "cuda" else None
    )
    pipe.to(device)
    print(f"Magic Brain loaded on {device.upper()}!")
except Exception as e:
    print(f"Failed to load Magic Brain: {e}")
    pipe = None

class MagicRequest(BaseModel):
    prompt: str
    steps: int = 1 # SDXL Turbo only needs 1 step!
    guidance_scale: float = 0.0

@app.post("/generate")
async def generate(request: MagicRequest):
    if pipe is None:
        raise HTTPException(status_code=500, detail="Magic Brain not initialized.")

    try:
        # Generate the magic
        image = pipe(
            prompt=request.prompt, 
            num_inference_steps=request.steps, 
            guidance_scale=request.guidance_scale
        ).images[0]

        # Convert to Base64 to send to the project
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return {"image": f"data:image/png;base64,{img_str}"}
    except Exception as e:
        print(f"Casting Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
