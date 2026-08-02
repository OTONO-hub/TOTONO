type TodayGreetingProps = {
  username?: string | null;
};

type GreetingContent = {
  greeting: string;
  message: string;
};

function getCurrentHourInJapan(): number {
  const hour = new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      hourCycle: "h23",
    }
  ).format(new Date());

  return Number(hour);
}

function getGreetingContent(
  currentHour: number
): GreetingContent {
  if (
    currentHour >= 5 &&
    currentHour < 11
  ) {
    return {
      greeting: "おはようございます。",
      message: "静かな一日の始まりに。",
    };
  }

  if (
    currentHour >= 11 &&
    currentHour < 17
  ) {
    return {
      greeting: "こんにちは。",
      message: "少し、呼吸を整えませんか。",
    };
  }

  return {
    greeting: "おつかれさまでした。",
    message: "今日を静かにほどく場所を。",
  };
}

export function TodayGreeting({
  username,
}: TodayGreetingProps) {
  const currentHour =
    getCurrentHourInJapan();

  const content =
    getGreetingContent(currentHour);

  const greeting = username
    ? `${content.greeting.replace(
        "。",
        ""
      )}、${username}さん。`
    : content.greeting;

  return (
    <section
      aria-labelledby="today-greeting-title"
      className="max-w-3xl"
    >
      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-[0.22em]
          text-muted-foreground
        "
      >
        Today
      </p>

      <h1
        id="today-greeting-title"
        className="
          mt-4
          text-[2rem]
          font-semibold
          leading-[1.25]
          tracking-[-0.045em]
          text-foreground
          sm:text-[2.5rem]
          lg:text-[3rem]
        "
      >
        {greeting}
      </h1>

      <p
        className="
          mt-4
          max-w-xl
          text-base
          leading-8
          text-muted-foreground
          sm:text-lg
        "
      >
        {content.message}
      </p>
    </section>
  );
}

