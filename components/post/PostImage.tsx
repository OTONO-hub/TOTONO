import Image from "next/image";

type Props = {
  imageUrl: string;
  saunaName: string;
};

export function PostImage({
  imageUrl,
  saunaName,
}: Props) {
  return (
    <figure className="relative aspect-16/10 w-full overflow-hidden rounded-[1.75rem] bg-muted">
      <Image
        src={imageUrl}
        alt={`${saunaName}の投稿画像`}
        fill
        sizes="(max-width: 768px) 100vw, 900px"
        className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
      />
    </figure>
  );
}