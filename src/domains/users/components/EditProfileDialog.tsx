import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarCropDialog } from "@/components/ui/AvatarCropDialog";
import { updateProfile } from "@/domains/users/slice";
import { updateUserAvatar } from "@/domains/auth/slice";
import type { AppDispatch, RootState } from "@/app/store";
import type { UserProfile } from "@/domains/users/types";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
}

export function EditProfileDialog({ open, onOpenChange, profile }: EditProfileDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const usernameChanged = username !== profile.username;
  const bioChanged = bio !== (profile.bio ?? "");
  const avatarChanged = avatarPreview !== profile.avatar;
  const hasChanges = usernameChanged || bioChanged || avatarChanged;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleCropConfirm(croppedBase64: string) {
    setCropSrc(null);
    setAvatarPreview(croppedBase64);
  }

  function handleRemoveAvatar() {
    setAvatarPreview(null);
  }

  async function handleSave() {
    if (!username.trim()) {
      toast.error("Le nom d'utilisateur est requis");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      toast.error("Le nom d'utilisateur ne peut contenir que des lettres, chiffres et _");
      return;
    }

    setIsSubmitting(true);
    const result = await dispatch(updateProfile({
      ...(usernameChanged && { username: username.trim() }),
      ...(bioChanged && { bio }),
      ...(avatarChanged && { avatar: avatarPreview }),
    }));

    if (updateProfile.fulfilled.match(result)) {
      if (avatarChanged && currentUser) {
        dispatch(updateUserAvatar(avatarPreview ?? ""));
      }
      toast.success("Profil mis à jour");
      onOpenChange(false);
    } else {
      toast.error((result.payload as string) ?? "Erreur lors de la mise à jour");
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <AvatarCropDialog
        imageSrc={cropSrc ?? ""}
        open={!!cropSrc}
        onClose={() => setCropSrc(null)}
        onConfirm={handleCropConfirm}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="w-[560px] max-w-[95vw] p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-9"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </Button>
              <DialogTitle className="text-[17px] font-extrabold">Modifier le profil</DialogTitle>
            </div>
            <Button
              size="sm"
              className="rounded-full font-bold h-8 px-4 text-sm bg-foreground text-background hover:bg-foreground/90"
              disabled={!hasChanges || isSubmitting}
              onClick={handleSave}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogHeader>

          {/* Banner placeholder */}
          <div className="h-28 bg-sky-500/20 dark:bg-sky-950/60" />

          {/* Avatar section */}
          <div className="px-4 -mt-10 mb-4">
            <div className="relative inline-block">
              <Avatar className="size-20 ring-4 ring-background shadow-md">
                <AvatarImage src={avatarPreview ?? undefined} alt={username} />
                <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold text-2xl">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                  aria-label="Changer la photo"
                >
                  <Camera className="size-4 text-white" />
                </button>
                {avatarPreview && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                    aria-label="Supprimer la photo"
                  >
                    <Trash2 className="size-4 text-white" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Fields */}
          <div className="px-4 pb-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                placeholder="nom_utilisateur"
                className="rounded-xl focus-visible:ring-sky-500"
              />
              <p className="text-xs text-muted-foreground">Lettres, chiffres et _ uniquement</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                placeholder="Parlez de vous..."
                className="resize-none min-h-20 rounded-xl focus-visible:ring-sky-500"
              />
              <p className="text-xs text-muted-foreground text-right">{160 - bio.length} caractères restants</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
