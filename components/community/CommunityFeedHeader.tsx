import {
  MessageCircle,
  Sparkles,
} from "lucide-react";

type CommunityFeedHeaderProps = {
  postCount: number;
};

export function CommunityFeedHeader({
  postCount,
}: CommunityFeedHeaderProps) {
  return (
    <div
      className="
        mb-8
        flex
        flex-col
        gap-5
        border-b border-border/55
        pb-7
        sm:flex-row
        sm:items-end
        sm:justify-between
      "
    >
      <div>
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-full
              bg-accent/20
              text-foreground
            "
          >
            <Sparkles
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
            "
          >
            Latest Activities
          </p>
        </div>

        <h2
          id="community-feed-heading"
          className="
            mt-5
            text-3xl
            font-semibold
            tracking-[-0.04em]
            text-foreground
            sm:text-4xl
          "
        >
          最新のサ活
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-7
            text-muted-foreground
          "
        >
          TOTONOに投稿された新しい記録を、
          ゆっくり眺めてみましょう。
        </p>
      </div>

      <div
        className="
          inline-flex
          w-fit
          items-center
          gap-2
          rounded-full
          border border-border/55
          bg-card/80
          px-4
          py-2
          text-xs
          font-semibold
          text-muted-foreground
          shadow-sm
          backdrop-blur-md
        "
      >
        <MessageCircle
          className="size-4"
          strokeWidth={1.7}
          aria-hidden="true"
        />

        {postCount}件のサ活
      </div>
    </div>
  );
}
