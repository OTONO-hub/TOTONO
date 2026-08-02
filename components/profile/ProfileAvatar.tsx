import Image from "next/image";
import { UserRound } from "lucide-react";

type ProfileAvatarProps = {
  avatarUrl: string | null;
  username: string | null;
  size?: "sm" | "md" | "lg" | "xl";

  /*
   * ユーザー名と同じリンク内に配置するなど、
   * アバターが視覚的な装飾のみの場合に使用します。
   */
  decorative?: boolean;
};

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-16",
  xl: "size-28",
} as const;

const iconSizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
  xl: "size-14",
} as const;

const imageSizes = {
  sm: "32px",
  md: "40px",
  lg: "64px",
  xl: "112px",
} as const;

export function ProfileAvatar({
  avatarUrl,
  username,
  size = "md",
  decorative = false,
}: ProfileAvatarProps) {
  const normalizedUsername =
    username?.trim() || null;

  const accessibleLabel =
    normalizedUsername
      ? `${normalizedUsername}のプロフィール画像`
      : "ユーザーのプロフィール画像";

  return (
    <div
      role={
        !avatarUrl && !decorative
          ? "img"
          : undefined
      }
      aria-label={
        !avatarUrl && !decorative
          ? accessibleLabel
          : undefined
      }
      aria-hidden={
        decorative
          ? "true"
          : undefined
      }
      className={`
        relative
        shrink-0
        overflow-hidden
        rounded-full
        border
        border-border/55
        bg-muted
        ${sizeClasses[size]}
      `}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={
            decorative
              ? ""
              : accessibleLabel
          }
          fill
          sizes={imageSizes[size]}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="
            flex
            size-full
            items-center
            justify-center
          "
        >
          <UserRound
            aria-hidden="true"
            className={`
              text-muted-foreground
              ${iconSizeClasses[size]}
            `}
          />
        </div>
      )}
    </div>
  );
}
