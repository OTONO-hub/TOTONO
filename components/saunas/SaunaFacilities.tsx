import type { ReactNode } from "react";
import {
  Armchair,
  Car,
  Check,
  Minus,
  Snowflake,
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
      description:
        "身体を温めるサウナ設備があります",
      available: hasSaunaRoom,
      icon: (
        <Waves
          className="size-5"
          strokeWidth={1.7}
        />
      ),
    },
    {
      label: "水風呂",
      description:
        "サウナ後に利用できる水風呂があります",
      available: hasColdBath,
      icon: (
        <Snowflake
          className="size-5"
          strokeWidth={1.7}
        />
      ),
    },
    {
      label: "外気浴",
      description:
        "外の空気で休憩できる場所があります",
      available: hasOutdoorAirBath,
      icon: (
        <Trees
          className="size-5"
          strokeWidth={1.7}
        />
      ),
    },
    {
      label: "休憩スペース",
      description:
        "入浴後にくつろげる場所があります",
      available: hasRestArea,
      icon: (
        <Armchair
          className="size-5"
          strokeWidth={1.7}
        />
      ),
    },
    {
      label: "食事処",
      description:
        "施設内で食事を楽しめます",
      available: hasRestaurant,
      icon: (
        <UtensilsCrossed
          className="size-5"
          strokeWidth={1.7}
        />
      ),
    },
    {
      label: "駐車場",
      description:
        "車で訪問できる駐車設備があります",
      available: hasParking,
      icon: (
        <Car
          className="size-5"
          strokeWidth={1.7}
        />
      ),
    },
  ];

  const availableFacilityCount =
    facilities.filter(
      (facility) => facility.available
    ).length;

  return (
    <section
      aria-labelledby="facility-features-heading"
      className="
        mt-10
        rounded-[2rem]
        border
        border-black/5
        bg-white
        p-6
        shadow-sm
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-black/5
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
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
              text-sm
              leading-7
              text-[#3e3a3a]/60
            "
          >
            訪問前に、施設で利用できる設備を
            確認できます。
          </p>
        </div>

        <div
          className="
            inline-flex
            w-fit
            items-center
            rounded-full
            bg-[#e6e5ef]/70
            px-4
            py-2
            text-sm
            font-medium
            text-[#3e3a3a]
          "
        >
          {availableFacilityCount} /{" "}
          {facilities.length} 設備
        </div>
      </div>

      <div
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
        ※ 設備情報は登録内容に基づいています。
        最新情報は施設の公式サイトでもご確認ください。
      </p>
    </section>
  );
}

type FacilityFeatureCardProps = {
  facility: FacilityItem;
};

function FacilityFeatureCard({
  facility,
}: FacilityFeatureCardProps) {
  return (
    <div
      className={`
        flex
        min-h-36
        flex-col
        justify-between
        rounded-[1.5rem]
        border
        p-5
        ${
          facility.available
            ? `
                border-[#00b4b6]/15
                bg-[#00b4b6]/5
              `
            : `
                border-black/5
                bg-[#e6e5ef]/30
              `
        }
      `}
    >
      <div
        className="
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
            ${
              facility.available
                ? `
                    bg-white
                    text-[#007f81]
                    shadow-sm
                  `
                : `
                    bg-white/70
                    text-[#3e3a3a]/40
                  `
            }
          `}
        >
          {facility.icon}
        </span>

        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            px-3
            py-1.5
            text-xs
            font-medium
            ${
              facility.available
                ? `
                    bg-[#00b4b6]/10
                    text-[#007f81]
                  `
                : `
                    bg-[#3e3a3a]/5
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
              />
              あり
            </>
          ) : (
            <>
              <Minus
                className="size-3.5"
                strokeWidth={2}
              />
              なし
            </>
          )}
        </span>
      </div>

      <div className="mt-5">
        <h3
          className={`
            text-base
            font-semibold
            ${
              facility.available
                ? "text-[#3e3a3a]"
                : "text-[#3e3a3a]/55"
            }
          `}
        >
          {facility.label}
        </h3>

        <p
          className="
            mt-1.5
            text-xs
            leading-5
            text-[#3e3a3a]/50
          "
        >
          {facility.description}
        </p>
      </div>
    </div>
  );
}
