import type {
  PostImage as PostImageRecord,
} from "@/services/post-images";

type LightboxFooterProps = {
  helpTextId: string;
  images: PostImageRecord[];
  activeIndex: number;
  onChangeImage: (
    index: number
  ) => void;
};

export function LightboxFooter({
  helpTextId,
  images,
  activeIndex,
  onChangeImage,
}: LightboxFooterProps) {
  return (
    <footer
      className="
        absolute
        inset-x-0
        bottom-0
        z-30
        flex
        flex-col
        items-center
        gap-3
        bg-linear-to-t
        from-black/75
        to-transparent
        px-4
        pb-[max(1rem,env(safe-area-inset-bottom))]
        pt-8
      "
    >
      {images.length > 1 ? (
        <div
          role="group"
          aria-label="表示する投稿画像を選択"
          className="
            flex
            max-w-full
            items-center
            gap-1
            overflow-x-auto
            rounded-full
            bg-black/40
            px-2
            py-1
            backdrop-blur-md
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {images.map(
            (image, index) => {
              const isActive =
                index === activeIndex;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    onChangeImage(index)
                  }
                  aria-label={`${images.length}枚中${index + 1}枚目の投稿画像を表示`}
                  aria-pressed={isActive}
                  className="
                    group
                    inline-flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-white
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-black
                  "
                >
                  <span
                    aria-hidden="true"
                    className={`
                      block
                      size-2.5
                      rounded-full
                      transition-all
                      duration-200
                      motion-reduce:transition-none
                      ${
                        isActive
                          ? "scale-125 bg-white"
                          : "bg-white/35 group-hover:bg-white/70"
                      }
                    `}
                  />
                </button>
              );
            }
          )}
        </div>
      ) : null}

      <p
        id={helpTextId}
        className="
          max-w-xl
          text-center
          text-xs
          leading-relaxed
          text-white/70
        "
      >
        左右の矢印キーまたは横スワイプで移動できます。ピンチ、ダブルクリック、プラス・マイナスキーで拡大縮小できます。Escキーで閉じます。
      </p>
    </footer>
  );
}
