"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Clock3,
  Info,
  Sparkles,
  Users,
} from "lucide-react";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";

type CrowdLevel =
  | "quiet"
  | "moderate"
  | "busy";

type CrowdForecastItem = {
  time: string;
  level: CrowdLevel;
};

type CrowdDisplay = {
  label: string;
  description: string;
  percentage: number;
};

type TodayCrowdContentProps = {
  sauna: TodaySauna;
};

const DEFAULT_ARRIVAL_TIME =
  "18:30";

function createArrivalStorageKey(
  saunaId: string
): string {
  return `totono:today-arrival-time:${saunaId}`;
}

function isValidTime(
  value: string
): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(
    value
  );
}

function loadArrivalTime(
  saunaId: string
): string {
  if (
    typeof window === "undefined"
  ) {
    return DEFAULT_ARRIVAL_TIME;
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        createArrivalStorageKey(
          saunaId
        )
      );

    if (
      storedValue &&
      isValidTime(storedValue)
    ) {
      return storedValue;
    }
  } catch {
    // localStorageが利用できない場合は、
    // 初期時刻を使用します。
  }

  return DEFAULT_ARRIVAL_TIME;
}

function getHourFromTime(
  time: string
): number {
  const [hourText] =
    time.split(":");

  return Number(hourText);
}

function getCrowdLevel(
  hour: number,
  dayOfWeek: number
): CrowdLevel {
  const isWeekend =
    dayOfWeek === 0 ||
    dayOfWeek === 6;

  if (isWeekend) {
    if (
      hour >= 14 &&
      hour <= 21
    ) {
      return "busy";
    }

    if (
      hour >= 10 &&
      hour < 14
    ) {
      return "moderate";
    }

    return "quiet";
  }

  if (
    hour >= 18 &&
    hour <= 21
  ) {
    return "busy";
  }

  if (
    hour >= 16 &&
    hour < 18
  ) {
    return "moderate";
  }

  if (
    hour >= 12 &&
    hour < 16
  ) {
    return "moderate";
  }

  return "quiet";
}

function getCrowdDisplay(
  level: CrowdLevel
): CrowdDisplay {
  if (level === "quiet") {
    return {
      label: "比較的空いていそう",
      description:
        "ゆっくり過ごしやすい時間帯と予測しています。",
      percentage: 30,
    };
  }

  if (level === "moderate") {
    return {
      label: "やや混雑しそう",
      description:
        "一部の設備で待ち時間が発生する可能性があります。",
      percentage: 60,
    };
  }

  return {
    label: "混雑しそう",
    description:
      "サウナ室や休憩スペースが混み合う可能性があります。",
    percentage: 85,
  };
}

function addHoursToTime(
  baseTime: string,
  offsetHours: number
): string {
  const [
    hourText,
    minuteText,
  ] = baseTime.split(":");

  const hour =
    Number(hourText);

  const minute =
    Number(minuteText);

  const totalMinutes =
    hour * 60 +
    minute +
    offsetHours * 60;

  const minutesInDay =
    24 * 60;

  const normalizedMinutes =
    ((totalMinutes %
      minutesInDay) +
      minutesInDay) %
    minutesInDay;

  const resultHour =
    Math.floor(
      normalizedMinutes / 60
    );

  const resultMinute =
    normalizedMinutes % 60;

  return `${String(
    resultHour
  ).padStart(
    2,
    "0"
  )}:${String(
    resultMinute
  ).padStart(
    2,
    "0"
  )}`;
}

function createForecast(
  arrivalTime: string,
  dayOfWeek: number
): CrowdForecastItem[] {
  return [-2, -1, 0, 1, 2].map(
    (offset) => {
      const time =
        addHoursToTime(
          arrivalTime,
          offset
        );

      return {
        time,
        level: getCrowdLevel(
          getHourFromTime(time),
          dayOfWeek
        ),
      };
    }
  );
}

function getRecommendedTime(
  forecast: CrowdForecastItem[]
): string {
  const quietItem =
    forecast.find(
      (item) =>
        item.level === "quiet"
    );

  if (quietItem) {
    return quietItem.time;
  }

  const moderateItem =
    forecast.find(
      (item) =>
        item.level ===
        "moderate"
    );

  return (
    moderateItem?.time ??
    forecast[0]?.time ??
    DEFAULT_ARRIVAL_TIME
  );
}

function getLevelLabel(
  level: CrowdLevel
): string {
  if (level === "quiet") {
    return "空き";
  }

  if (
    level === "moderate"
  ) {
    return "普通";
  }

  return "混雑";
}

function getLevelClassName(
  level: CrowdLevel
): string {
  if (level === "quiet") {
    return `
      bg-success/15
      text-success
    `;
  }

  if (
    level === "moderate"
  ) {
    return `
      bg-accent/20
      text-foreground
    `;
  }

  return `
    bg-error/15
    text-error
  `;
}

function TodayCrowdContent({
  sauna,
}: TodayCrowdContentProps) {
  const [
    arrivalTime,
    setArrivalTime,
  ] = useState(
    DEFAULT_ARRIVAL_TIME
  );

  useEffect(() => {
    const frameId =
      window.requestAnimationFrame(
        () => {
          setArrivalTime(
            loadArrivalTime(
              sauna.id
            )
          );
        }
      );

    return () => {
      window.cancelAnimationFrame(
        frameId
      );
    };
  }, [sauna.id]);

  const dayOfWeek =
    useMemo(
      () =>
        new Date().getDay(),
      []
    );

  const currentLevel =
    useMemo(
      () =>
        getCrowdLevel(
          getHourFromTime(
            arrivalTime
          ),
          dayOfWeek
        ),
      [
        arrivalTime,
        dayOfWeek,
      ]
    );

  const crowdDisplay =
    getCrowdDisplay(
      currentLevel
    );

  const forecast =
    useMemo(
      () =>
        createForecast(
          arrivalTime,
          dayOfWeek
        ),
      [
        arrivalTime,
        dayOfWeek,
      ]
    );

  const recommendedTime =
    getRecommendedTime(
      forecast
    );

  return (
    <section
      aria-labelledby="today-crowd-heading"
      className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          overflow-hidden
          rounded-[2rem]
          border
          border-border/55
          bg-card/85
          shadow-sm
          backdrop-blur-md
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-border/45
            px-6
            py-6
            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:px-8
            sm:py-8
            lg:px-10
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-muted-foreground
              "
            >
              <Sparkles
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Crowd Forecast
            </div>

            <h2
              id="today-crowd-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.04em]
                text-foreground
                sm:text-3xl
              "
            >
              混雑の目安
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              {sauna.name}の到着予定時刻をもとに、
              混雑傾向を予測しています。
            </p>
          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-full
              border
              border-border/55
              bg-background/70
              px-4
              py-2
              text-xs
              font-semibold
              text-foreground
              sm:self-auto
            "
          >
            <Clock3
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {arrivalTime} 到着予定
          </div>
        </div>

        <div
          className="
            grid
            gap-5
            px-6
            py-6
            sm:px-8
            sm:py-8
            lg:grid-cols-[0.85fr_1.15fr]
            lg:px-10
          "
        >
          <div
            className="
              flex
              flex-col
              justify-between
              rounded-[1.5rem]
              bg-primary
              p-6
              text-primary-foreground
            "
          >
            <div>
              <span
                className="
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                  bg-white/15
                "
              >
                <Users
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <p
                className="
                  mt-6
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-primary-foreground/60
                "
              >
                Estimated Crowd
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  tracking-[-0.04em]
                "
              >
                {crowdDisplay.label}
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-primary-foreground/70
                "
              >
                {crowdDisplay.description}
              </p>
            </div>

            <div className="mt-10">
              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                    text-primary-foreground/70
                  "
                >
                  混雑度
                </span>

                <span
                  className="
                    text-3xl
                    font-semibold
                    tracking-[-0.05em]
                  "
                >
                  {crowdDisplay.percentage}
                  <span
                    className="
                      ml-1
                      text-sm
                      font-medium
                      text-primary-foreground/60
                    "
                  >
                    %
                  </span>
                </span>
              </div>

              <div
                className="
                  mt-4
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-white/15
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-accent
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${crowdDisplay.percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="
              rounded-[1.5rem]
              border
              border-border/50
              bg-background/65
              p-5
              sm:p-6
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    text-muted-foreground
                  "
                >
                  おすすめの訪問時間
                </p>

                <p
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                  "
                >
                  {recommendedTime}頃
                </p>
              </div>

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  self-start
                  rounded-full
                  bg-success/15
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-success
                  sm:self-auto
                "
              >
                <Users
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                比較的ゆったり
              </span>
            </div>

            <div
              className="
                mt-7
                grid
                grid-cols-5
                gap-2
              "
            >
              {forecast.map(
                (item) => {
                  const isArrival =
                    item.time ===
                    arrivalTime;

                  return (
                    <div
                      key={item.time}
                      className={`
                        rounded-[1rem]
                        border
                        px-2
                        py-4
                        text-center
                        ${
                          isArrival
                            ? `
                              border-primary
                              bg-primary
                              text-primary-foreground
                            `
                            : `
                              border-border/50
                              bg-card
                              text-foreground
                            `
                        }
                      `}
                    >
                      <p
                        className={`
                          text-xs
                          font-semibold
                          tabular-nums
                          ${
                            isArrival
                              ? "text-primary-foreground"
                              : "text-foreground"
                          }
                        `}
                      >
                        {item.time}
                      </p>

                      <span
                        className={`
                          mt-3
                          inline-flex
                          rounded-full
                          px-2
                          py-1
                          text-[0.625rem]
                          font-semibold
                          ${
                            isArrival
                              ? `
                                bg-white/15
                                text-primary-foreground
                              `
                              : getLevelClassName(
                                  item.level
                                )
                          }
                        `}
                      >
                        {getLevelLabel(
                          item.level
                        )}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <p
              className="
                mt-5
                text-xs
                leading-6
                text-muted-foreground
              "
            >
              到着予定時刻の前後2時間を表示しています。
              時刻を変更する場合は「今日の予定」カードから設定してください。
            </p>
          </div>
        </div>

        <div
          className="
            flex
            items-start
            gap-3
            border-t
            border-border/45
            px-6
            py-5
            sm:px-8
            lg:px-10
          "
        >
          <span
            className="
              flex
              size-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-secondary/20
              text-foreground
            "
          >
            <Info
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>

          <p
            className="
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            この混雑情報はリアルタイムの施設データではありません。曜日と時間帯から算出したTOTONO独自の参考予測です。実際の混雑状況とは異なる場合があります。
          </p>
        </div>
      </div>
    </section>
  );
}

export function TodayCrowdCard() {
  const [todaySauna] =
    useTodaySauna();

  if (!todaySauna) {
    return null;
  }

  return (
    <TodayCrowdContent
      key={todaySauna.id}
      sauna={todaySauna}
    />
  );
}
