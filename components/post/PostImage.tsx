import Image from "next/image";

type Props = {
  imageUrl: string;
  saunaName: string;
};

export function PostImage({
  imageUrl,
  saunaName,
}: Props) {
  const normalizedSaunaName =
    saunaName.trim();

  const imageAlt =
    normalizedSaunaName.length > 0
      ? `${normalizedSaunaName}の投稿画像`
      : "サウナ施設の投稿画像";

  return (
    <div
      className="
        relative
        aspect-16/10
        w-full
        overflow-hidden
        rounded-[1.75rem]
        bg-muted
      "
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="
          (max-width: 639px)
          calc(100vw - 2.5rem),
          (max-width: 1023px)
          calc(100vw - 5rem),
          42rem
        "
        className="
          object-cover
          transition-transform
          duration-700
          ease-out
          hover:scale-[1.03]
          motion-reduce:transition-none
          motion-reduce:hover:scale-100
        "
      />
    </div>
  );
}
