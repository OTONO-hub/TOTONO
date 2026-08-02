"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

import { LightboxFooter } from "@/components/post/lightbox/LightboxFooter";
import { LightboxHeader } from "@/components/post/lightbox/LightboxHeader";
import { LightboxNavigation } from "@/components/post/lightbox/LightboxNavigation";
import { useImageZoom } from "@/components/post/lightbox/useImageZoom";
import { useLightboxNavigation } from "@/components/post/lightbox/useLightboxNavigation";
import type {
  PostImage as PostImageRecord,
} from "@/services/post-images";

type ImageLightboxProps = {
  images: PostImageRecord[];
  saunaName: string;
  initialIndex: number;
  onClose: () => void;
};

const MIN_SCALE = 1;

export function ImageLightbox({
  images,
  saunaName,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  if (
    typeof document === "undefined" ||
    images.length === 0
  ) {
    return null;
  }

  return createPortal(
    <ImageLightboxDialog
      images={images}
      saunaName={saunaName}
      initialIndex={initialIndex}
      onClose={onClose}
    />,
    document.body
  );
}

function ImageLightboxDialog({
  images,
  saunaName,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const helpTextId = useId();

  const dialogRef =
    useRef<HTMLDivElement>(null);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  const previousBodyOverflowRef =
    useRef("");

  const navigationCallbacksRef =
    useRef({
      previous: () => {},
      next: () => {},
    });

  const zoom = useImageZoom({
    minScale: MIN_SCALE,
    onSwipePrevious: () => {
      navigationCallbacksRef.current.previous();
    },
    onSwipeNext: () => {
      navigationCallbacksRef.current.next();
    },
  });

  const navigation =
    useLightboxNavigation({
      imageCount: images.length,
      initialIndex,
      onBeforeChange:
        zoom.resetTransform,
    });

  const {
    activeIndex,
    hasPrevious,
    hasNext,
    showPrevious,
    showNext,
    changeImage,
  } = navigation;

  const {
    isAtMinimumScale,
    isAtMaximumScale,
    isTransformed,
    zoomIn,
    zoomOut,
    resetTransform,
  } = zoom;

  useEffect(() => {
    navigationCallbacksRef.current = {
      previous: showPrevious,
      next: showNext,
    };
  }, [
    showNext,
    showPrevious,
  ]);

  const currentImage =
    images[activeIndex];

  /*
   * 現在画像の前後を事前読み込みし、
   * 画像切り替え時の表示待ちを減らします。
   */
  useEffect(() => {
    const adjacentImages = [
      images[
        activeIndex - 1
      ],
      images[
        activeIndex + 1
      ],
    ].filter(
      (
        image
      ): image is PostImageRecord =>
        Boolean(image)
    );

    for (const image of adjacentImages) {
      const preloadImage =
        new window.Image();

      preloadImage.src =
        image.image_url;
    }
  }, [
    activeIndex,
    images,
  ]);

  const handleKeyDown =
    useCallback(
      (event: KeyboardEvent) => {
        if (
          event.key === "Escape"
        ) {
          event.preventDefault();
          onClose();
          return;
        }

        if (
          event.key === "Tab"
        ) {
          trapFocus(
            event,
            dialogRef.current
          );
          return;
        }

        if (
          event.key ===
            "ArrowLeft" &&
          isAtMinimumScale
        ) {
          event.preventDefault();
          showPrevious();
          return;
        }

        if (
          event.key ===
            "ArrowRight" &&
          isAtMinimumScale
        ) {
          event.preventDefault();
          showNext();
          return;
        }

        if (
          event.key === "+" ||
          event.key === "="
        ) {
          event.preventDefault();
          zoomIn();
          return;
        }

        if (
          event.key === "-"
        ) {
          event.preventDefault();
          zoomOut();
        }
      },
      [
        isAtMinimumScale,
        onClose,
        showNext,
        showPrevious,
        zoomIn,
        zoomOut,
      ]
    );

  /*
   * 背景スクロール停止と初期フォーカスは、
   * Lightboxを開いた時に一度だけ行います。
   *
   * キーボード操作の依存値が変化しても、
   * 閉じるボタンへフォーカスを戻しません。
   */
  useEffect(() => {
    previousBodyOverflowRef.current =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const focusAnimationFrame =
      window.requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });

    return () => {
      window.cancelAnimationFrame(
        focusAnimationFrame
      );

      document.body.style.overflow =
        previousBodyOverflowRef.current;
    };
  }, []);

  /*
   * キーボードイベントは、最新のナビゲーション・
   * ズーム状態を利用できるよう個別に管理します。
   */
  useEffect(() => {
    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [handleKeyDown]);

  if (!currentImage) {
    return null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${saunaName}の投稿画像を全画面表示`}
      aria-describedby={helpTextId}
      tabIndex={-1}
      className="
        fixed
        inset-0
        z-[100]
        bg-black/95
        text-white
        outline-none
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
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

      <LightboxHeader
        activeIndex={activeIndex}
        imageCount={images.length}
        closeButtonRef={
          closeButtonRef
        }
        canZoomOut={
          !isAtMinimumScale
        }
        canZoomIn={
          !isAtMaximumScale
        }
        canReset={
          isTransformed
        }
        onZoomOut={zoomOut}
        onZoomIn={zoomIn}
        onReset={
          resetTransform
        }
        onClose={onClose}
      />

      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          overflow-hidden
          px-3
          py-24
          sm:px-16
        "
      >
        <div
          className="
            relative
            flex
            size-full
            touch-none
            select-none
            items-center
            justify-center
            overflow-hidden
          "
          onPointerDown={
            zoom.handlePointerDown
          }
          onPointerMove={
            zoom.handlePointerMove
          }
          onPointerUp={
            zoom.handlePointerEnd
          }
          onPointerCancel={
            zoom.handlePointerEnd
          }
          onDoubleClick={
            zoom.toggleDoubleClickZoom
          }
        >
          <div
            className="
              relative
              size-full
              transition-transform
              duration-150
              ease-out
              motion-reduce:transition-none
            "
            style={{
              transform: `translate3d(${zoom.translate.x}px, ${zoom.translate.y}px, 0) scale(${zoom.scale})`,
            }}
          >
            <Image
              src={
                currentImage.image_url
              }
              alt={`${saunaName}の投稿画像${activeIndex + 1}`}
              fill
              priority
              sizes="100vw"
              draggable={false}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <LightboxNavigation
        showPrevious={
          hasPrevious &&
          isAtMinimumScale
        }
        showNext={
          hasNext &&
          isAtMinimumScale
        }
        onPrevious={
          showPrevious
        }
        onNext={
          showNext
        }
      />

      <LightboxFooter
        helpTextId={helpTextId}
        images={images}
        activeIndex={activeIndex}
        onChangeImage={
          changeImage
        }
      />
    </div>
  );
}

function trapFocus(
  event: KeyboardEvent,
  container: HTMLElement | null
): void {
  if (!container) {
    return;
  }

  const focusableElements =
    Array.from(
      container.querySelectorAll<HTMLElement>(
        [
          "button:not([disabled])",
          "a[href]",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          '[tabindex]:not([tabindex="-1"])',
        ].join(",")
      )
    ).filter(
      (element) =>
        !element.hasAttribute(
          "aria-hidden"
        ) &&
        element.getAttribute(
          "aria-disabled"
        ) !== "true" &&
        element.offsetParent !== null
    );

  if (
    focusableElements.length === 0
  ) {
    event.preventDefault();
    container.focus();
    return;
  }

  const firstElement =
    focusableElements[0];

  const lastElement =
    focusableElements[
      focusableElements.length - 1
    ];

  const activeElement =
    document.activeElement;

  if (
    !container.contains(
      activeElement
    )
  ) {
    event.preventDefault();
    firstElement.focus();
    return;
  }

  if (
    event.shiftKey &&
    activeElement === firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (
    !event.shiftKey &&
    activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}
