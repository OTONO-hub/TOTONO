import type { ReactNode } from "react";
import {
  Armchair,
  Car,
  Check,
  Minus,
  Snowflake,
  Sparkles,
  Trees,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

type SaunaFacilitiesProps = {
  hasSaunaRoom: boolean;
  hasColdBath: boolean;
  hasOutdoorAirBath: boolean;
  hasRestArea: boolean;
  hasRestaurant: boolean;
  hasParking: boolean;
};

type FacilityItem = {
  label: string;
  description: string;
  available: boolean;
  icon: ReactNode;
};

export function SaunaFacilities({
  hasSaunaRoom,
  hasColdBath,
  hasOutdoorAirBath,
  hasRestArea,
  hasRestaurant,
  hasParking,
}: SaunaFacilitiesProps) {
  const facilities: FacilityItem[] = [
    {
      label: "サウナ室",
      description: "身体を温めるサウナ設備があります",
      available: hasSaunaRoom,
      icon: (
        <Waves
          className="size-5"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    },
    {
      label: "水風呂",
      description: "サウナ後に利用できる水風呂があります",
      available: hasColdBath,
      icon: (
        <Snowflake
          className="size-5"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    },
    {
      label: "外気浴",
      description: "外の空気で休憩できる場所があります",
      available: hasOutdoorAirBath,
      icon: (
        <Trees
          className="size-5"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    },
    {
      label: "休憩スペース",
      description: "入浴後にくつろげる場所があります",
      available: hasRestArea,
      icon: (
        <Armchair
          className="size-5"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    },
    {
      label: "食事処",
      description: "施設内で食事を楽しめます",
      available: hasRestaurant,
      icon: (
        <UtensilsCrossed
          className="size-5"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    },
    {
      label: "駐車場",
      description: "車で訪問できる駐車設備があります",
      available: hasParking,
      icon: (
        <Car
          className="size-5"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    },
  ];

  const availableFacilityCount = facilities.filter(
    (facility) => facility.available
  ).length;

  const facilityIntroduction =
    createFacilityIntroduction({
      hasSaunaRoom,
      hasColdBath,
      hasOutdoorAirBath,
      hasRestArea,
      hasRestaurant,
      hasParking,
    });

  return (
    <section
      aria-labelledby="facility-features-heading"
      className="
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-white/70
        bg-white/85
        p-6
        shadow-[0_18px_60px_rgba(62,58,58,0.07)]
        backdrop-blur-xl
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-[#3e3a3a]/8
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#3e3a3a]/45
            "
          >
            Facilities
          </p>

          <h2
            id="facility-features-heading"
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            設備・特徴
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-[#3e3a3a]/60
            "
          >
            訪問前に、施設で利用できる設備を確認できます。
          </p>
        </div>

        <div
          aria-label={`${facilities.length}件中${availableFacilityCount}件の設備が利用できます`}
          className="
            inline-flex
            w-fit
            shrink-0
            items-center
            gap-2
            rounded-full
            border
            border-white/80
            bg-[#e6e5ef]/65
            px-4
            py-2
            text-sm
            font-medium
            text-[#3e3a3a]
            shadow-sm
            backdrop-blur-md
          "
        >
          <span
            className="
              size-2
              rounded-full
              bg-[#00b4b6]
              shadow-[0_0_0_4px_rgba(0,180,182,0.1)]
            "
            aria-hidden="true"
          />

          <span>
            {availableFacilityCount} / {facilities.length} 設備
          </span>
        </div>
      </div>

      <aside
        aria-labelledby="facility-introduction-heading"
        className="
          mt-8
          overflow-hidden
          rounded-[1.75rem]
          border
          border-[#9fd9f6]/30
          bg-linear-to-br
          from-[#9fd9f6]/18
          via-white/85
          to-[#fdd000]/8
          p-5
          shadow-[0_14px_36px_rgba(62,58,58,0.05)]
          sm:p-6
        "
      >
        <div className="flex items-start gap-4">
          <span
            className="
              flex
              size-11
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/90
              text-[#3e3a3a]
              shadow-sm
            "
            aria-hidden="true"
          >
            <Sparkles
              className="size-5 text-[#00b4b6]"
              strokeWidth={1.8}
            />
          </span>

          <div className="min-w-0">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#3e3a3a]/40
              "
            >
              From TOTONO
            </p>

            <h3
              id="facility-introduction-heading"
              className="
                mt-1.5
                text-lg
                font-semibold
                tracking-[-0.025em]
                text-[#3e3a3a]
              "
            >
              TOTONOより
            </h3>

            <p
              className="
                mt-3
                max-w-3xl
                text-sm
                leading-7
                text-[#3e3a3a]/65
                sm:text-base
              "
            >
              {facilityIntroduction}
            </p>
          </div>
        </div>
      </aside>

      <div
        role="list"
        aria-label="施設の設備一覧"
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {facilities.map((facility) => (
          <FacilityFeatureCard
            key={facility.label}
            facility={facility}
          />
        ))}
      </div>

      <p
        className="
          mt-6
          text-xs
          leading-6
          text-[#3e3a3a]/45
        "
      >
        ※ 設備情報は登録内容に基づいています。最新情報は施設の公式サイトでもご確認ください。
      </p>
    </section>
  );
}

type FacilityIntroductionOptions = {
  hasSaunaRoom: boolean;
  hasColdBath: boolean;
  hasOutdoorAirBath: boolean;
  hasRestArea: boolean;
  hasRestaurant: boolean;
  hasParking: boolean;
};

function createFacilityIntroduction({
  hasSaunaRoom,
  hasColdBath,
  hasOutdoorAirBath,
  hasRestArea,
  hasRestaurant,
  hasParking,
}: FacilityIntroductionOptions) {
  if (
    hasSaunaRoom &&
    hasColdBath &&
    hasOutdoorAirBath &&
    hasRestArea &&
    hasRestaurant
  ) {
    return "サウナと水風呂、外気浴をひと通り楽しんだあと、休憩や食事までゆったり満喫できる施設です。";
  }

  if (
    hasSaunaRoom &&
    hasColdBath &&
    hasOutdoorAirBath
  ) {
    return "サウナで温まり、水風呂で身体を冷やし、外気浴でゆっくり休める環境が整っています。";
  }

  if (
    hasSaunaRoom &&
    hasColdBath &&
    hasRestArea
  ) {
    return "サウナと水風呂を楽しんだあと、休憩スペースで落ち着いて過ごせる施設です。";
  }

  if (
    hasSaunaRoom &&
    hasRestaurant
  ) {
    return "サウナを楽しんだあと、施設内の食事処でサ飯まで楽しめます。";
  }

  if (
    hasOutdoorAirBath &&
    hasRestArea
  ) {
    return "外の空気を感じながら休憩でき、入浴後もゆったり過ごしやすい施設です。";
  }

  if (hasSaunaRoom && hasColdBath) {
    return "サウナと水風呂を備えており、温冷交代浴を楽しめます。";
  }

  if (hasSaunaRoom) {
    return "サウナ設備を備えており、自分のペースで身体を温められる施設です。";
  }

  if (hasRestaurant && hasRestArea) {
    return "休憩や食事を楽しみながら、ゆったり過ごしやすい施設です。";
  }

  if (hasParking) {
    return "駐車場を利用できるため、車で訪れやすい施設です。";
  }

  return "登録されている設備情報を確認しながら、自分に合った過ごし方を見つけてみてください。";
}

type FacilityFeatureCardProps = {
  facility: FacilityItem;
};

function FacilityFeatureCard({
  facility,
}: FacilityFeatureCardProps) {
  const availabilityLabel = facility.available
    ? "利用できます"
    : "利用できません";

  return (
    <article
      role="listitem"
      aria-label={`${facility.label}は${availabilityLabel}`}
      className={`
        group
        relative
        flex
        min-h-40
        flex-col
        justify-between
        overflow-hidden
        rounded-[1.5rem]
        border
        p-5
        transition-all
        duration-300
        ease-out
        motion-reduce:transform-none
        motion-reduce:transition-none
        ${
          facility.available
            ? `
                border-[#00b4b6]/15
                bg-linear-to-br
                from-white/95
                to-[#00b4b6]/8
                shadow-[0_12px_30px_rgba(0,180,182,0.06)]
                hover:-translate-y-1
                hover:border-[#00b4b6]/25
                hover:shadow-[0_18px_38px_rgba(0,180,182,0.12)]
              `
            : `
                border-[#3e3a3a]/7
                bg-[#e6e5ef]/35
                hover:-translate-y-0.5
                hover:border-[#3e3a3a]/12
                hover:bg-[#e6e5ef]/50
                hover:shadow-[0_12px_28px_rgba(62,58,58,0.06)]
              `
        }
      `}
    >
      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10
          size-28
          rounded-full
          blur-2xl
          transition-opacity
          duration-300
          ${
            facility.available
              ? "bg-[#9fd9f6]/25 opacity-60 group-hover:opacity-90"
              : "bg-white/50 opacity-40 group-hover:opacity-70"
          }
        `}
        aria-hidden="true"
      />

      <div
        className="
          relative
          z-10
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <span
          className={`
            flex
            size-11
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition
            duration-300
            motion-reduce:transform-none
            motion-reduce:transition-none
            ${
              facility.available
                ? `
                    border-white/80
                    bg-white/90
                    text-[#007f81]
                    shadow-sm
                    backdrop-blur-md
                    group-hover:scale-105
                    group-hover:shadow-md
                  `
                : `
                    border-white/60
                    bg-white/65
                    text-[#3e3a3a]/38
                    backdrop-blur-md
                    group-hover:bg-white/85
                  `
            }
          `}
          aria-hidden="true"
        >
          {facility.icon}
        </span>

        <span
          className={`
            inline-flex
            shrink-0
            items-center
            gap-1.5
            rounded-full
            border
            px-3
            py-1.5
            text-xs
            font-medium
            backdrop-blur-md
            ${
              facility.available
                ? `
                    border-[#00b4b6]/10
                    bg-[#00b4b6]/10
                    text-[#007f81]
                  `
                : `
                    border-[#3e3a3a]/5
                    bg-white/45
                    text-[#3e3a3a]/45
                  `
            }
          `}
        >
          {facility.available ? (
            <>
              <Check
                className="size-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
              あり
            </>
          ) : (
            <>
              <Minus
                className="size-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
              なし
            </>
          )}
        </span>
      </div>

      <div className="relative z-10 mt-6 min-w-0">
        <h3
          className={`
            wrap-break-words
            text-base
            font-semibold
            tracking-[-0.015em]
            ${
              facility.available
                ? "text-[#3e3a3a]"
                : "text-[#3e3a3a]/58"
            }
          `}
        >
          {facility.label}
        </h3>

        <p
          className={`
            mt-1.5
            wrap-break-words
            text-xs
            leading-5
            ${
              facility.available
                ? "text-[#3e3a3a]/52"
                : "text-[#3e3a3a]/42"
            }
          `}
        >
          {facility.description}
        </p>
      </div>
    </article>
  );
}
