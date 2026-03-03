import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, UserRound, Plus } from "lucide-react";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchUserProfile,
  fetchUserTweets,
  clearProfile,
  toggleFollow,
} from "@/domains/users/slice";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { AvatarCropDialog } from "@/components/ui/AvatarCropDialog";
import { TweetCard } from "@/domains/tweets/components/TweetCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { profile, tweets, isLoading, error, isFollowLoading } = useSelector(
    (state: RootState) => state.userProfile,
  );

  const isOwnProfile = currentUser?.id === id;
  const {
    fileInputRef,
    isUploading,
    cropSrc,
    handleFileChange,
    handleCropConfirm,
    handleCropClose,
  } = useAvatarUpload(id ?? "");

  useEffect(() => {
    if (!id) return;
    dispatch(clearProfile());
    dispatch(fetchUserProfile(id));
    dispatch(fetchUserTweets({ userId: id }));
  }, [id, dispatch]);

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="size-20 rounded-full bg-muted flex items-center justify-center">
            <UserRound className="size-10 text-muted-foreground/40" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-bold">Utilisateur introuvable</p>
            <p className="text-sm text-muted-foreground">
              Ce profil n'existe pas ou a été supprimé.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full mt-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4 mr-1" /> Retour
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      {isOwnProfile && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {isOwnProfile && (
        <AvatarCropDialog
          imageSrc={cropSrc ?? ""}
          open={!!cropSrc}
          onClose={handleCropClose}
          onConfirm={handleCropConfirm}
        />
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/75 backdrop-blur-md border-b border-border px-4 h-13.25 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="min-w-0">
          {profile ? (
            <>
              <p className="font-bold text-[15px] leading-tight truncate">
                {profile.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile._count.tweets} posts
              </p>
            </>
          ) : (
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-14" />
            </div>
          )}
        </div>
      </div>

      {/* Banner */}
      <div className="h-32.5 bg-sky-500/20 dark:bg-sky-950/60" />

      {/* Profil info */}
      <div className="px-4 pt-3 pb-4 border-b border-border">
        <div className="flex items-start justify-between -mt-14 mb-3">
          {profile ? (
            <Avatar
              className="size-18 ring-4 ring-background shadow-md"
              onClick={() => isOwnProfile && fileInputRef.current?.click()}
              style={{ cursor: isOwnProfile ? "pointer" : "default" }}
            >
              <AvatarImage
                src={profile.avatar ?? undefined}
                alt={profile.username}
              />
              <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold text-2xl">
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
              {isOwnProfile && (
                <AvatarBadge className="size-5! bg-sky-500 border-background hover:bg-sky-400 transition-colors flex items-center justify-center">
                  {isUploading ? (
                    <span className="size-2.5 rounded-full border-[1.5px] border-white border-t-transparent animate-spin" />
                  ) : (
                    <Plus
                      className="size-3! text-background font-bold"
                      strokeWidth={3}
                    />
                  )}
                </AvatarBadge>
              )}
            </Avatar>
          ) : (
            <Skeleton className="size-18 rounded-full ring-4 ring-background" />
          )}

          <div className="mt-16">
            <AnimatePresence mode="wait">
              {!isLoading && profile && isOwnProfile && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Button
                    variant="outline"
                    className="rounded-full font-bold h-9 px-4 text-sm"
                  >
                    Modifier le profil
                  </Button>
                </motion.div>
              )}
              {!isLoading && profile && !isOwnProfile && (
                <motion.div
                  key="follow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Button
                    disabled={isFollowLoading}
                    variant={profile.isFollowing ? "default" : "outline"}
                    onClick={() => dispatch(toggleFollow(id ?? ""))}
                    className="rounded-full font-bold h-9 px-6 text-sm"
                  >
                    {isFollowLoading
                      ? "..."
                      : profile.isFollowing
                        ? "Ne plus suivre"
                        : "Suivre"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {profile ? (
          <div className="space-y-2">
            <div>
              <h1 className="font-extrabold text-[20px] leading-tight">
                {profile.username}
              </h1>
              <p className="text-[15px] text-muted-foreground">
                @{profile.username}
              </p>
            </div>

            {profile.bio && (
              <p className="text-[15px] leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              <span>Inscrit en {formatDate(profile.createdAt)}</span>
            </div>

            <div className="flex gap-4 text-sm pt-1">
              {isOwnProfile && (
                <span>
                  <span className="font-bold text-foreground">
                    {profile._count.following}
                  </span>{" "}
                  <span className="text-muted-foreground">abonnements</span>
                </span>
              )}
              <span>
                <span className="font-bold text-foreground">
                  {profile._count.followers}
                </span>{" "}
                <span className="text-muted-foreground">abonnés</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-4 pt-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        )}
      </div>

      {/* Tab Posts */}
      <div className="border-b border-border">
        <div className="px-4 h-13.25 flex items-stretch">
          <div className="relative flex items-center px-1">
            <span className="font-bold text-[15px]">Posts</span>
            <div className="absolute bottom-0 inset-x-0 h-0.75 rounded-full bg-sky-500" />
          </div>
        </div>
      </div>

      {/* List tweets */}
      <div className="flex flex-col">
        {isLoading && tweets.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="px-4 py-3 border-b border-border flex gap-3"
            >
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))
        ) : tweets.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <UserRound className="size-8 text-muted-foreground/40" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">Aucun post pour l'instant</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isOwnProfile
                  ? "Publiez votre premier tweet !"
                  : "Cet utilisateur n'a pas encore publié."}
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {tweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
}
