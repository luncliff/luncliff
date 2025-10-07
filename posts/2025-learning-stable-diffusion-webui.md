
2023년에 잠깐 맛보기만 해봤던 Stable Diffusion 도구에 대해서 공부한 내용.

마침 Stable Diffusion Art에서 9월 말에 Tutorial 갱신이 확인됨.

## References

- https://stable-diffusion-art.com/beginners-guide/
- https://github.com/AUTOMATIC1111/stable-diffusion-webui

## Setup

### System Check

Surface Book 3에서 구동하는 것이 목표

```console
> systeminfo
System Manufacturer:           Microsoft Corporation
System Model:                  Surface Book 3
System Type:                   x64-based PC
```

```console
> nvidia-smi.exe --list-gpus
GPU 0: NVIDIA GeForce GTX 1660 Ti with Max-Q Design (UUID: GPU-...)
```

CUDA 12.8 설치되어있는데, 업그레이드 해야겠다...

- https://nvidia.com/en-us/software/nvidia-app/
- https://developer.nvidia.com/cuda-toolkit
- https://developer.nvidia.com/cudnn-archive

```console
> nvidia-smi.exe -q
Driver Version                            : 581.42
CUDA Version                              : 13.0

Attached GPUs                             : 1
GPU 00000000:02:00.0
    Product Name                          : NVIDIA GeForce GTX 1660 Ti with Max-Q Design
    Product Brand                         : GeForce
    Product Architecture                  : Turing
...
```

Python 3.10.11 (Microsoft Store) 버전을 사용함.

```powershell
git clone --depth=1 --branch=v1.10.1 "https://github.com/AUTOMATIC1111/stable-diffusion-webui"
Push-Location "stable-diffusion-webui"
    git pull --tags
    # ... python virtual environment setup ...
Pop-Location
```

```powershell
# python virtual environment setup
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements_versions.txt
```

### PyTorch with CUDA

- ❌ https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.10.1
- ❓ https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.9.4

Readme를 따라서 설치해보니 PyTorch 2.8.0 CPU 버전이 사용되는 것을 확인함.

```python3
import torch

print("PyTorch:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())
print("CUDA:", torch.version.cuda)
print("cuDNN:", torch.backends.cudnn.version())
print("GPU count:", torch.cuda.device_count())
```

확인해보니, 사용중인 Desktop에서는 GPU 사용이 기본으로 활성화 되어있음. Surface Book 3에서도 GPU사용이 필요할 것으로 예상되므로, [Previous PyTorch Versions](https://pytorch.org/get-started/previous-versions/)를 참고하면서 가능한 PyTorch를 점진적으로 탐색.
적당히 오래된 버전인 2.2.0 버전부터 시작함.

```powershell
# commands to Copy-Paste in Windows Terminal
pip install torch==2.2.0 torchvision==0.17.0 torchaudio==2.2.0 --index-url https://download.pytorch.org/whl/cu121
python -m pip install -r requirement_versions.txt
```

```
# requirements_versions.txt patch
# pip install ... --index-url https://download.pytorch.org/whl/cu121
torch==2.2.0
torchvision==0.17.0
torchaudio==2.2.0
```

### Downloading SafeTensors

...

- https://huggingface.co/stable-diffusion-v1-5
- https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0

#### Extensions

- https://github.com/picobyte/stable-diffusion-webui-wd14-tagger

## Notes

...
