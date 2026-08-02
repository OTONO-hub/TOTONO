import type { SaunaXpResult } from "@/services/profile-xp";

type Props = {
  xp: SaunaXpResult;
};

export function XpStatusCard({
  xp,
}: Props) {
  return (
    <section
      className="
        rounded-[2rem]
        border border-black/5
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="space-y-6">
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-neutral-500
            "
          >
            LEVEL
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
              text-[#3e3a3a]
            "
          >
            {xp.level}
          </h2>
        </div>

        <div>
          <div
            className="
              h-3
              overflow-hidden
              rounded-full
              bg-neutral-200
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-[#fdd000]
                transition-all
              "
              style={{
                width: `${xp.progressPercentage}%`,
              }}
            />
          </div>

          <div
            className="
              mt-4
              flex
              items-end
              justify-between
            "
          >
            <div>
              <p
                className="
                  text-3xl
                  font-bold
                  text-[#3e3a3a]
                "
              >
                {xp.currentXp.toLocaleString()} XP
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-neutral-500
                "
              >
                {xp.nextLevel
                  ? `あと ${xp.xpUntilNextLevel.toLocaleString()} XPで ${xp.nextLevel}`
                  : "最高ランクに到達しました"}
              </p>
            </div>

            <div
              className="
                text-right
              "
            >
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-neutral-400
                "
              >
                Progress
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-semibold
                "
              >
                {xp.progressPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
