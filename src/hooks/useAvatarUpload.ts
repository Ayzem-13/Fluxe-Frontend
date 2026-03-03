import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import type { AppDispatch } from "@/app/store";
import { updateUserAvatar } from "@/domains/auth/slice";
import { fetchUserProfile } from "@/domains/users/slice";
import { usersApi } from "@/domains/users/api";

export function useAvatarUpload(profileId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCropConfirm(croppedBase64: string) {
    setCropSrc(null);
    setIsUploading(true);
    try {
      await usersApi.updateMe({ avatar: croppedBase64 });
      dispatch(updateUserAvatar(croppedBase64));
      dispatch(fetchUserProfile(profileId));
      toast.success("Photo de profil mise à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploading(false);
    }
  }

  function handleCropClose() {
    setCropSrc(null);
  }

  return {
    fileInputRef,
    isUploading,
    cropSrc,
    openFilePicker,
    handleFileChange,
    handleCropConfirm,
    handleCropClose,
  };
}
