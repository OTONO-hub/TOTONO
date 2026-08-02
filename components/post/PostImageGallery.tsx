"use client";

import {
  type KeyboardEvent,
  type UIEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  Images,
  Maximize2,
} from "lucide-react";

import { ImageLightbox } from "@/components/post/lightbox/ImageLightbox";
import type {
  PostImage as PostImageRecord,
} from "@/services/post-images";

type PostImageGalleryProps = {
  images: PostImageRecord[];
  saunaName: string;
};

export function PostImageGallery({
  images,
  saunaName,
}: PostImageGalleryProps) {
  const [
    lightboxIndex,
    setLightboxIndex,
  ] = useState<number | null>(null);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const galleryRef =
    useRef<HTMLDivElement>(null);

  const imageButtonRefs =
    useRef<
      Array<HTMLButtonElement | null>
    >([]);

  const scrollFrameRef =
    useRef<number | null>(null);

  const focusFrameRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (
        scrollFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          scrollFrameRef.current
        );
      }

      if (
        focusFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          focusFrameRef.current
        );
      }
    };
  }, []);

  if (images.length === 0) {
    return null;
  }

  const handleGalleryScroll = (
    event: UIEvent<HTMLDivElement>
  ) => {
    if (
      scrollFrameRef.current !== null
    ) {
      window.cancelAnimationFrame(
        scrollFrameRef.current
      );
    }

    const gallery =
      event.currentTarget;

    scrollFrameRef.current =
      window.requestAnimationFrame(
        () => {
          const slideWidth =
            gallery.clientWidth;

          if (slideWidth <= 0) {
            scrollFrameRef.current =
              null;
            return;
          }

          const nextIndex =
            Math.round(
              gallery.scrollLeft /
                slideWidth
            );

          const normalizedIndex =
            Math.max(
              0,
              Math.min(
                images.length - 1,
                nextIndex
              )
            );

          setActiveIndex(
            normalizedIndex
          );

          scrollFrameRef.current =
            null;
        }
      );
  };

  const scrollToImage = (
    index: number,
    behavior: ScrollBehavior = "smooth"
  ) => {
    const gallery =
      galleryRef.current;

    if (!gallery) {
      return;
    }

    const normalizedIndex =
      Math.max(
        0,
        Math.min(
          images.length - 1,
          index
        )
      );

    gallery.scrollTo({
      left:
        gallery.clientWidth *
        normalizedIndex,
      behavior,
    });

    setActiveIndex(
      normalizedIndex
    );
  };

  const handleGalleryKeyDown = (
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();

      scrollToImage(
        activeIndex - 1
      );

      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();

      scrollToImage(
        activeIndex + 1
      );

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();

      scrollToImage(0);

      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      scrollToImage(
        images.length - 1
      );
    }
  };

  const openLightbox = (
    index: number
  ) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    const previousIndex =
      lightboxIndex;

    setLightboxIndex(null);

    if (previousIndex === null) {
      return;
    }

    focusFrameRef.current =
      window.requestAnimationFrame(
        () => {
          imageButtonRefs.current[
            previousIndex
          ]?.focus();

          focusFrameRef.current =
            null;
        }
      );
  };

  return (
    <>
      <section
        aria-label={`${saunaName}の投稿画像ギャラリー`}
        aria-roledescription="カルーセル"
        className="
          relative
          overflow-hidden
          rounded-[1.5rem]
          border border-border/35
          bg-muted
          shadow-sm
          sm:rounded-[1.75rem]
        "
      >
        <p
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {images.length}枚中
          {activeIndex + 1}
          枚目を表示しています。
        </p>

        <div
          ref={galleryRef}
          tabIndex={0}
          onScroll={
            handleGalleryScroll
          }
          onKeyDown={
            handleGalleryKeyDown
          }
          className="
            flex
            snap-x
            snap-mandatory
            overflow-x-auto
            overscroll-x-contain
            scroll-smooth
            [scrollbar-width:none]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-ring
            motion-reduce:scroll-auto
            [&::-webkit-scrollbar]:hidden
          "
          aria-label={`${saunaName}の投稿画像。左右の矢印キーで画像を切り替えられます`}
        >
          {images.map(
            (image, index) => (
              <figure
                key={image.id}
                aria-label={`${images.length}枚中${index + 1}枚目`}
                aria-roledescription="スライド"
                className="
                  relative
                  aspect-[4/3]
                  min-w-full
                  snap-center
                  overflow-hidden
                  bg-muted
                "
              >
                <Image
                  src={image.image_url}
                  alt={`${saunaName}の投稿画像${index + 1}`}
                  fill
                  sizes="
                    (max-width: 767px)
                    calc(100vw - 2.5rem),
                    42rem
                  "
                  className="object-cover"
                />

                <button
                  ref={(button) => {
                    imageButtonRefs.current[
                      index
                    ] = button;
                  }}
                  type="button"
                  onClick={() =>
                    openLightbox(index)
                  }
                  aria-label={`${saunaName}の投稿画像${index + 1}を全画面で表示`}
                  className="
                    group
                    absolute
                    inset-0
                    z-10
                    cursor-zoom-in
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-inset
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-3
                      right-3
                      inline-flex
                      size-11
                      items-center
                      justify-center
                      rounded-full
                      bg-black/55
                      text-white
                      opacity-0
                      shadow-sm
                      backdrop-blur-sm
                      transition-opacity
                      group-hover:opacity-100
                      group-focus-visible:opacity-100
                      motion-reduce:transition-none
                    "
                  >
                    <Maximize2
                      className="size-4"
                      strokeWidth={1.8}
                    />
                  </span>
                </button>

                {images.length > 1 ? (
                  <figcaption
                    className="
                      absolute
                      right-3
                      top-3
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-black/65
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      tabular-nums
                      text-white
                      shadow-sm
                      backdrop-blur-sm
                    "
                  >
                    <Images
                      className="size-3.5"
                      aria-hidden="true"
                    />

                    {index + 1} /{" "}
                    {images.length}
                  </figcaption>
                ) : null}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    ring-1
                    ring-inset
                    ring-white/15
                  "
                />
              </figure>
            )
          )}
        </div>

        {images.length > 1 ? (
          <div
            role="group"
            aria-label="表示する投稿画像を選択"
            className="
              flex
              items-center
              justify-center
              gap-1
              border-t
              border-border/35
              bg-card/90
              px-4
              py-1
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
                      scrollToImage(index)
                    }
                    aria-label={`${index + 1}枚目の投稿画像を表示`}
                    aria-pressed={isActive}
                    className="
                      group
                      inline-flex
                      size-11
                      items-center
                      justify-center
                      rounded-full
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-ring
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-card
                    "
                  >
                    <span
                      aria-hidden="true"
                      className={`
                        block
                        size-2
                        rounded-full
                        transition-all
                        duration-200
                        motion-reduce:transition-none
                        ${
                          isActive
                            ? "scale-125 bg-foreground/70"
                            : "bg-foreground/20 group-hover:bg-foreground/40"
                        }
                      `}
                    />
                  </button>
                );
              }
            )}
          </div>
        ) : null}
      </section>

      {lightboxIndex !== null ? (
        <ImageLightbox
          images={images}
          saunaName={saunaName}
          initialIndex={
            lightboxIndex
          }
          onClose={
            closeLightbox
          }
        />
      ) : null}
    </>
  );
}
