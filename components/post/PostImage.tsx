import Image from "next/image";

type Props = {
  imageUrl: string;
  saunaName: string;
};

export function PostImage({ imageUrl, saunaName }: Props) {
  return (
    <div className="relative mt-4 h-80 w-full overflow-hidden rounded-2xl">
      <Image
        src={imageUrl}
        alt={saunaName}
        fill
        className="object-cover transition duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, 768px"
      />
    </div>
  );
}