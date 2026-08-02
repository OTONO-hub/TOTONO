"use client";

import type { ReactNode } from "react";
import {
  useEffect,
  useState,
} from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  RefreshCw,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { BackgroundGlow } from "@/components/ui/background-glow";
import { PageSection } from "@/components/ui/page-section";

type WeatherData = {
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  observedAt: string;
};

type WeatherApiResponse = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    precipitation?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    time?: string;
  };
};

type WeatherDisplay = {
  label: string;
  icon: ReactNode;
};

type OutdoorAirScore = {
  score: number;
  label: string;
  description: string;
};

type TodayWeatherContentProps = {
  sauna: TodaySauna;
};

const LOCATION_NOT_AVAILABLE =
  "LOCATION_NOT_AVAILABLE";

const WEATHER_REQUEST_FAILED =
  "WEATHER_REQUEST_FAILED";

const WEATHER_RESPONSE_INVALID =
  "WEATHER_RESPONSE_INVALID";

function isFiniteNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function createWeatherUrl(
  sauna: TodaySauna
): string | null {
  if (
    sauna.latitude === null ||
    sauna.longitude === null
  ) {
    return null;
  }

  const searchParams =
    new URLSearchParams({
      latitude:
        sauna.latitude.toString(),
      longitude:
        sauna.longitude.toString(),
      current: [
        "temperature_2m",
        "apparent_temperature",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
      ].join(","),
      timezone: "Asia/Tokyo",
    });

  return `https://api.open-meteo.com/v1/forecast?${searchParams.toString()}`;
}

function parseWeatherData(
  response: WeatherApiResponse
): WeatherData | null {
  const current =
    response.current;

  if (!current) {
    return null;
  }

  if (
    !isFiniteNumber(
      current.temperature_2m
    ) ||
    !isFiniteNumber(
      current.apparent_temperature
    ) ||
    !isFiniteNumber(
      current.precipitation
    ) ||
    !isFiniteNumber(
      current.weather_code
    ) ||
    !isFiniteNumber(
      current.wind_speed_10m
    ) ||
    typeof current.time !==
      "string"
  ) {
    return null;
  }

  return {
    temperature:
      current.temperature_2m,
    apparentTemperature:
      current.apparent_temperature,
    precipitation:
      current.precipitation,
    weatherCode:
      current.weather_code,
    windSpeed:
      current.wind_speed_10m,
    observedAt: current.time,
  };
}

async function fetchWeather(
  sauna: TodaySauna
): Promise<WeatherData> {
  const weatherUrl =
    createWeatherUrl(sauna);

  if (!weatherUrl) {
    throw new Error(
      LOCATION_NOT_AVAILABLE
    );
  }

  const response =
    await fetch(weatherUrl, {
      cache: "no-store",
    });

  if (!response.ok) {
    throw new Error(
      WEATHER_REQUEST_FAILED
    );
  }

  const responseData =
    (await response.json()) as WeatherApiResponse;

  const parsedWeather =
    parseWeatherData(
      responseData
    );

  if (!parsedWeather) {
    throw new Error(
      WEATHER_RESPONSE_INVALID
    );
  }

  return parsedWeather;
}

function createWeatherErrorMessage(
  error: unknown
): string {
  if (
    error instanceof Error &&
    error.message ===
      LOCATION_NOT_AVAILABLE
  ) {
    return "この施設には位置情報が登録されていないため、天気を取得できません。";
  }

  return "天気情報を取得できませんでした。時間をおいて再度お試しください。";
}

function getWeatherDisplay(
  weatherCode: number
): WeatherDisplay {
  if (weatherCode === 0) {
    return {
      label: "快晴",
      icon: (
        <Sun
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (
    weatherCode === 1 ||
    weatherCode === 2
  ) {
    return {
      label: "晴れ時々くもり",
      icon: (
        <CloudSun
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (weatherCode === 3) {
    return {
      label: "くもり",
      icon: (
        <Cloud
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (
    weatherCode === 45 ||
    weatherCode === 48
  ) {
    return {
      label: "霧",
      icon: (
        <CloudFog
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (
    weatherCode >= 51 &&
    weatherCode <= 67
  ) {
    return {
      label: "雨",
      icon: (
        <CloudRain
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (
    weatherCode >= 71 &&
    weatherCode <= 77
  ) {
    return {
      label: "雪",
      icon: (
        <CloudSnow
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (
    weatherCode >= 80 &&
    weatherCode <= 82
  ) {
    return {
      label: "にわか雨",
      icon: (
        <CloudRain
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (
    weatherCode >= 85 &&
    weatherCode <= 86
  ) {
    return {
      label: "にわか雪",
      icon: (
        <CloudSnow
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  if (weatherCode >= 95) {
    return {
      label: "雷雨",
      icon: (
        <CloudLightning
          className="size-7"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ),
    };
  }

  return {
    label: "天気情報",
    icon: (
      <Cloud
        className="size-7"
        strokeWidth={1.7}
        aria-hidden="true"
      />
    ),
  };
}

function calculateOutdoorAirScore(
  weather: WeatherData
): OutdoorAirScore {
  let score = 100;

  const temperature =
    weather.apparentTemperature;

  if (
    temperature < 5 ||
    temperature > 34
  ) {
    score -= 35;
  } else if (
    temperature < 10 ||
    temperature > 30
  ) {
    score -= 20;
  } else if (
    temperature < 15 ||
    temperature > 27
  ) {
    score -= 10;
  }

  if (
    weather.windSpeed > 30
  ) {
    score -= 35;
  } else if (
    weather.windSpeed > 20
  ) {
    score -= 20;
  } else if (
    weather.windSpeed > 12
  ) {
    score -= 8;
  }

  if (
    weather.precipitation >= 5
  ) {
    score -= 35;
  } else if (
    weather.precipitation >= 1
  ) {
    score -= 20;
  } else if (
    weather.precipitation > 0
  ) {
    score -= 8;
  }

  const normalizedScore =
    Math.max(
      0,
      Math.min(100, score)
    );

  if (normalizedScore >= 85) {
    return {
      score: normalizedScore,
      label: "とても良い",
      description:
        "外気浴を心地よく楽しめそうなコンディションです。",
    };
  }

  if (normalizedScore >= 65) {
    return {
      score: normalizedScore,
      label: "良い",
      description:
        "体調を見ながら、外の空気をゆっくり楽しみましょう。",
    };
  }

  if (normalizedScore >= 40) {
    return {
      score: normalizedScore,
      label: "まずまず",
      description:
        "気温や風に注意し、短めの外気浴がおすすめです。",
    };
  }

  return {
    score: normalizedScore,
    label: "控えめに",
    description:
      "無理に外へ出ず、館内の休憩スペースも活用しましょう。",
  };
}

function formatObservedTime(
  observedAt: string
): string {
  const date =
    new Date(observedAt);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "現在";
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function TodayWeatherContent({
  sauna,
}: TodayWeatherContentProps) {
  const [
    weather,
    setWeather,
  ] = useState<WeatherData | null>(
    null
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialWeather() {
      try {
        const nextWeather =
          await fetchWeather(sauna);

        if (isCancelled) {
          return;
        }

        setWeather(nextWeather);
        setErrorMessage(null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setWeather(null);
        setErrorMessage(
          createWeatherErrorMessage(
            error
          )
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialWeather();

    return () => {
      isCancelled = true;
    };
  }, [sauna]);

  const handleReload =
    async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextWeather =
          await fetchWeather(sauna);

        setWeather(nextWeather);
      } catch (error) {
        setWeather(null);
        setErrorMessage(
          createWeatherErrorMessage(
            error
          )
        );
      } finally {
        setIsLoading(false);
      }
    };

  if (isLoading) {
    return (
      <PageSection
        as="section"
        aria-label="今日の天気を読み込み中"
        aria-busy="true"
      >
        <AppCard
          variant="glass"
          radius="xl"
          padding="none"
          className="
            min-h-72
            animate-pulse
            bg-card/55
            motion-reduce:animate-none
          "
        />
      </PageSection>
    );
  }

  if (
    errorMessage ||
    !weather
  ) {
    return (
      <PageSection
        as="section"
        aria-labelledby="today-weather-heading"
      >
        <AppCard
          variant="glass"
          radius="xl"
          padding="none"
          className="
            bg-card/85
            p-6
            sm:p-8
            lg:p-10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="max-w-2xl">
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
                <Cloud
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                Weather
              </div>

              <h2
                id="today-weather-heading"
                className="
                  mt-4
                  text-2xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-3xl
                "
              >
                今日の天気
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-muted-foreground
                "
              >
                {errorMessage}
              </p>
            </div>

            <AppButton
              type="button"
              variant="secondary"
              onClick={() =>
                void handleReload()
              }
              leadingIcon={
                <RefreshCw
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
            >
              再読み込み
            </AppButton>
          </div>
        </AppCard>
      </PageSection>
    );
  }

  const weatherDisplay =
    getWeatherDisplay(
      weather.weatherCode
    );

  const outdoorAirScore =
    calculateOutdoorAirScore(
      weather
    );

  const observedTime =
    formatObservedTime(
      weather.observedAt
    );

  return (
    <PageSection
      as="section"
      aria-labelledby="today-weather-heading"
    >
      <AppCard
        variant="glass"
        radius="xl"
        padding="none"
        className="bg-card/85"
      >
        <BackgroundGlow
          tone="secondary"
          position="top-right"
          size="lg"
          className="
            -right-28
            -top-32
            size-80
            bg-secondary/20
          "
        />

        <div
          className="
            relative
            border-b
            border-border/45
            px-6
            py-6
            sm:px-8
            sm:py-8
            lg:px-10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-end
              sm:justify-between
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

                Weather
              </div>

              <h2
                id="today-weather-heading"
                className="
                  mt-4
                  text-2xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-3xl
                "
              >
                今日の天気
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-muted-foreground
                "
              >
                {sauna.name}周辺の現在のコンディションです。
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void handleReload()
              }
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                self-start
                rounded-full
                px-4
                text-xs
                font-semibold
                text-muted-foreground
                transition
                duration-200
                hover:bg-muted
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
                sm:self-auto
              "
            >
              <RefreshCw
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {observedTime}時点
            </button>
          </div>
        </div>

        <div
          className="
            relative
            grid
            gap-5
            px-6
            py-6
            sm:grid-cols-2
            sm:px-8
            sm:py-8
            lg:grid-cols-[1.15fr_0.85fr]
            lg:px-10
          "
        >
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
                items-center
                justify-between
                gap-4
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
                  現在の天気
                </p>

                <p
                  className="
                    mt-2
                    text-lg
                    font-semibold
                    text-foreground
                  "
                >
                  {weatherDisplay.label}
                </p>
              </div>

              <span
                className="
                  flex
                  size-14
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary/25
                  text-foreground
                "
              >
                {weatherDisplay.icon}
              </span>
            </div>

            <div
              className="
                mt-8
                flex
                items-end
                gap-2
              "
            >
              <span
                className="
                  text-5xl
                  font-semibold
                  tracking-[-0.06em]
                  text-foreground
                "
              >
                {Math.round(
                  weather.temperature
                )}
              </span>

              <span
                className="
                  pb-1
                  text-xl
                  font-semibold
                  text-muted-foreground
                "
              >
                ℃
              </span>
            </div>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-3
              "
            >
              <div
                className="
                  rounded-[1rem]
                  bg-card
                  p-4
                "
              >
                <Thermometer
                  className="
                    size-4
                    text-muted-foreground
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <p
                  className="
                    mt-3
                    text-xs
                    text-muted-foreground
                  "
                >
                  体感温度
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  {Math.round(
                    weather.apparentTemperature
                  )}
                  ℃
                </p>
              </div>

              <div
                className="
                  rounded-[1rem]
                  bg-card
                  p-4
                "
              >
                <Wind
                  className="
                    size-4
                    text-muted-foreground
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <p
                  className="
                    mt-3
                    text-xs
                    text-muted-foreground
                  "
                >
                  風速
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  {weather.windSpeed.toFixed(
                    1
                  )}
                  km/h
                </p>
              </div>

              <div
                className="
                  rounded-[1rem]
                  bg-card
                  p-4
                "
              >
                <Droplets
                  className="
                    size-4
                    text-muted-foreground
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <p
                  className="
                    mt-3
                    text-xs
                    text-muted-foreground
                  "
                >
                  降水量
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  {weather.precipitation.toFixed(
                    1
                  )}
                  mm
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              flex
              flex-col
              justify-between
              rounded-[1.5rem]
              border
              border-border/50
              bg-primary
              p-5
              text-primary-foreground
              sm:p-6
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-primary-foreground/60
                "
              >
                Outdoor Air Index
              </p>

              <h3
                className="
                  mt-4
                  text-xl
                  font-semibold
                  tracking-[-0.03em]
                "
              >
                外気浴指数
              </h3>
            </div>

            <div className="my-8">
              <div
                className="
                  flex
                  items-end
                  gap-3
                "
              >
                <span
                  className="
                    text-6xl
                    font-semibold
                    tracking-[-0.07em]
                  "
                >
                  {outdoorAirScore.score}
                </span>

                <span
                  className="
                    pb-2
                    text-sm
                    font-semibold
                    text-primary-foreground/60
                  "
                >
                  / 100
                </span>
              </div>

              <div
                className="
                  mt-5
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
                    width: `${outdoorAirScore.score}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <p
                className="
                  text-base
                  font-semibold
                "
              >
                {outdoorAirScore.label}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-7
                  text-primary-foreground/70
                "
              >
                {outdoorAirScore.description}
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            relative
            border-t
            border-border/45
            px-6
            py-5
            sm:px-8
            lg:px-10
          "
        >
          <p
            className="
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            外気浴指数は気温・体感温度・風・降水量をもとにしたTOTONO独自の目安です。体調を最優先にご利用ください。
          </p>
        </div>
      </AppCard>
    </PageSection>
  );
}

export function TodayWeather() {
  const [todaySauna] =
    useTodaySauna();

  if (!todaySauna) {
    return null;
  }

  return (
    <TodayWeatherContent
      key={todaySauna.id}
      sauna={todaySauna}
    />
  );
}

