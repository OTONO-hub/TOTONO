import Image from "next/image";
import { UserRound } from "lucide-react";

type ProfileAvatarProps = {
  avatarUrl: string | null;
  username: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-16",
  xl: "size-28",
};

const iconSizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
  xl: "size-14",
};

const imageSizes = {
  sm: "32px",
  md: "40px",
  lg: "64px",
  xl: "112px",
};

export function ProfileAvatar({
  avatarUrl,
  username,
  size = "md",
}: ProfileAvatarProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border bg-muted ${sizeClasses[size]}`}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={
            username
              ? `${username}のプロフィール画像`
              : "プロフィール画像"
          }
          fill
          className="object-cover"
          sizes={imageSizes[size]}
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <UserRound
            className={`text-muted-foreground ${iconSizeClasses[size]}`}
          />
        </div>
      )}
    </div>
  );
}