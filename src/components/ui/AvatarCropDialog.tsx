import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarCropDialogProps {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (croppedBase64: string) => void;
}

async function getCroppedImage(imageSrc: string, cropArea: Area): Promise<string> {
  const img = new Image();
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d")!.drawImage(
    img,
    cropArea.x, cropArea.y,
    cropArea.width, cropArea.height,
    0, 0,
    size, size
  );
  return canvas.toDataURL("image/jpeg", 0.9);
}

export function AvatarCropDialog({ imageSrc, open, onClose, onConfirm }: AvatarCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  function handleReset() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    const result = await getCroppedImage(imageSrc, croppedAreaPixels);
    onConfirm(result);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-120 p-0 overflow-hidden rounded-2xl gap-0"
      >
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
          <DialogTitle className="text-base font-semibold">
            Modifier l'image
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Recadrez et zoomez votre avatar
          </DialogDescription>
        </DialogHeader>

        {/* Zone de crop pleine largeur */}
        <div className="relative w-full h-56 sm:h-72 bg-muted overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{ containerStyle: { width: "100%", height: "100%" } }}
          />
        </div>

        {/* Hint + Slider zoom */}
        <div className="px-6 pt-4 pb-1 flex items-center gap-3">
          <ImageIcon className="shrink-0 text-muted-foreground" style={{ width: 14, height: 14 }} />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <ImageIcon className="shrink-0 text-muted-foreground size-5" />
        </div>
        <p className="text-center text-xs text-muted-foreground pb-3">
          Glissez pour recadrer · Zoomez avec le curseur
        </p>
        <div className="border-b border-border" />

        <div className="px-5 py-4 flex flex-row items-center justify-between">
          <button
            onClick={handleReset}
            className="text-sm text-sky-500 hover:text-sky-400 hover:underline font-medium transition-colors"
          >
            Réinitialiser
          </button>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={onClose}>
              Annuler
            </Button>
            <Button className="rounded-full bg-sky-500 hover:bg-sky-400 text-white font-medium" onClick={handleConfirm}>
              Appliquer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
