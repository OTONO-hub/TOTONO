import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Bug,
  ChevronRight,
  CircleUserRound,
  FileWarning,
  Mail,
  MessageCircleQuestion,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "TOTONOへのお問い合わせ、不具合報告、施設情報の修正依頼、投稿削除依頼、アカウント削除依頼を受け付けています。",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "お問い合わせ｜TOTONO",
    description:
      "TOTONOへのお問い合わせ、不具合報告、施設情報の修正依頼、投稿削除依頼、アカウント削除依頼を受け付けています。",
    url: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

const contactCategories = [
  {
    title: "一般的なお問い合わせ",
    description:
      "TOTONOの使い方、サービス内容、今後の機能などに関するお問い合わせです。",
    icon: MessageCircleQuestion,
    subject: "TOTONOへのお問い合わせ",
  },
  {
    title: "不具合の報告",
    description:
      "画面が表示されない、操作できない、エラーが発生するなどのご報告です。",
    icon: Bug,
    subject: "TOTONO 不具合報告",
  },
  {
    title: "施設情報の修正",
    description:
      "施設名、住所、営業時間、設備など、掲載情報の修正依頼です。",
    icon: Building2,
    subject: "TOTONO 施設情報修正依頼",
  },
  {
    title: "投稿・画像の削除",
    description:
      "権利侵害、プライバシー侵害、不適切な投稿や画像に関する削除依頼です。",
    icon: FileWarning,
    subject: "TOTONO 投稿・画像削除依頼",
  },
  {
    title: "アカウントの削除",
    description:
      "TOTONOアカウントおよび関連データの削除に関する依頼です。",
    icon: CircleUserRound,
    subject: "TOTONO アカウント削除依頼",
  },
  {
    title: "権利侵害の申し立て",
    description:
      "著作権、肖像権、プライバシーその他の権利侵害に関するご連絡です。",
    icon: ShieldAlert,
    subject: "TOTONO 権利侵害に関する申し立て",
  },
] as const;

function createMailtoUrl(subject: string): string {
  const body = [
    "お問い合わせ内容をご記入ください。",
    "",
    "■ 対象ページのURL",
    "",
    "■ 発生した事象・ご依頼内容",
    "",
    "■ 発生日時",
    "",
    "■ ご利用環境",
    "端末：",
    "OS：",
    "ブラウザ：",
    "",
    "■ その他",
  ].join("\n");

  const parameters = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${CONTACT_EMAIL}?${parameters.toString()}`;
}

export default function ContactPage() {
  const hasContactEmail =
    CONTACT_EMAIL.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <nav
            aria-label="パンくずリスト"
            className="mb-8 text-sm text-muted-foreground"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="
                    rounded-sm
                    transition-colors
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                  "
                >
                  ホーム
                </Link>
              </li>

              <li aria-hidden="true">
                /
              </li>

              <li aria-current="page">
                お問い合わせ
              </li>
            </ol>
          </nav>

          <header className="border-b border-border/70 pb-10">
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.18em]
                text-muted-foreground
              "
            >
              Contact
            </p>

            <h1
              className="
                mt-4
                text-3xl
                font-semibold
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              お問い合わせ
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-8
                text-muted-foreground
                sm:text-lg
              "
            >
              TOTONOに関するご質問、不具合、施設情報の修正、
              投稿やアカウントの削除依頼などを受け付けています。
            </p>
          </header>

          <section
            aria-labelledby="contact-method-heading"
            className="mt-12"
          >
            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-muted-foreground
                "
              >
                Contact Method
              </p>

              <h2
                id="contact-method-heading"
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  tracking-tight
                  sm:text-3xl
                "
              >
                お問い合わせの種類
              </h2>

              <p className="mt-4 leading-8 text-muted-foreground">
                該当する項目を選択してください。
                送信時に必要な情報が入力しやすい形でメールが開きます。
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactCategories.map((category) => {
                const Icon = category.icon;

                if (!hasContactEmail) {
                  return (
                    <article
                      key={category.title}
                      className="
                        rounded-3xl
                        border border-border/60
                        bg-card/70
                        p-6
                        shadow-sm
                      "
                    >
                      <div
                        className="
                          flex
                          size-11
                          items-center
                          justify-center
                          rounded-2xl
                          bg-muted
                          text-foreground
                        "
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </div>

                      <h3 className="mt-5 text-lg font-semibold">
                        {category.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          text-sm
                          leading-7
                          text-muted-foreground
                        "
                      >
                        {category.description}
                      </p>

                      <p
                        className="
                          mt-5
                          text-sm
                          font-medium
                          text-muted-foreground
                        "
                      >
                        受付準備中
                      </p>
                    </article>
                  );
                }

                return (
                  <a
                    key={category.title}
                    href={createMailtoUrl(category.subject)}
                    className="
                      group
                      rounded-3xl
                      border border-border/60
                      bg-card/70
                      p-6
                      shadow-sm
                      transition
                      hover:-translate-y-0.5
                      hover:border-border
                      hover:shadow-md
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-ring
                      focus-visible:ring-offset-2
                      motion-reduce:transform-none
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="
                          flex
                          size-11
                          items-center
                          justify-center
                          rounded-2xl
                          bg-muted
                          text-foreground
                        "
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </div>

                      <ChevronRight
                        aria-hidden="true"
                        className="
                          mt-2
                          size-5
                          text-muted-foreground
                          transition-transform
                          group-hover:translate-x-1
                          motion-reduce:transform-none
                        "
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      {category.title}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        text-muted-foreground
                      "
                    >
                      {category.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>

          {!hasContactEmail && (
            <aside
              className="
                mt-10
                rounded-3xl
                border border-[#fdd000]/50
                bg-[#fdd000]/10
                p-6
                sm:p-8
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#fdd000]/25
                    text-foreground
                  "
                >
                  <Mail
                    aria-hidden="true"
                    className="size-5"
                  />
                </div>

                <div>
                  <h2 className="font-semibold">
                    お問い合わせ窓口を準備しています
                  </h2>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                  >
                    正式公開前にお問い合わせ用メールアドレスを設定し、
                    各窓口を利用できる状態にします。
                  </p>
                </div>
              </div>
            </aside>
          )}

          <section
            aria-labelledby="required-information-heading"
            className="
              mt-14
              rounded-3xl
              border border-border/60
              bg-muted/35
              p-6
              sm:p-8
            "
          >
            <h2
              id="required-information-heading"
              className="text-xl font-semibold"
            >
              お問い合わせ時に記載していただきたい情報
            </h2>

            <ul
              className="
                mt-5
                list-disc
                space-y-3
                pl-6
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              <li>
                お問い合わせ内容または発生した事象
              </li>

              <li>
                対象となるページや投稿、施設のURL
              </li>

              <li>
                不具合が発生した日時と操作手順
              </li>

              <li>
                利用した端末、OS、ブラウザ
              </li>

              <li>
                エラーメッセージや画面のスクリーンショット
              </li>

              <li>
                返信を希望する連絡先
              </li>
            </ul>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              パスワード、認証コード、クレジットカード情報、
              本人確認書類などの重要な情報は送信しないでください。
            </p>
          </section>

          <section
            aria-labelledby="response-heading"
            className="mt-14"
          >
            <h2
              id="response-heading"
              className="text-xl font-semibold sm:text-2xl"
            >
              回答について
            </h2>

            <div
              className="
                mt-5
                space-y-4
                text-sm
                leading-8
                text-muted-foreground
                sm:text-base
              "
            >
              <p>
                内容を確認したうえで、対応が必要なお問い合わせに
                順次回答します。
              </p>

              <p>
                内容によっては回答まで時間を要する場合や、
                個別の回答を行えない場合があります。
              </p>

              <p>
                権利侵害やアカウント削除に関する依頼では、
                本人確認または権利を確認するための追加情報を
                お願いする場合があります。
              </p>
            </div>
          </section>

          <section
            aria-labelledby="policy-heading"
            className="
              mt-14
              rounded-3xl
              border border-border/60
              bg-card/70
              p-6
              shadow-sm
              sm:p-8
            "
          >
            <h2
              id="policy-heading"
              className="text-xl font-semibold"
            >
              関連するポリシー
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/privacy"
                className="
                  flex
                  min-h-12
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border border-border/60
                  bg-background
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  transition
                  hover:bg-muted
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                "
              >
                プライバシーポリシー

                <ChevronRight
                  aria-hidden="true"
                  className="size-4"
                />
              </Link>

              <Link
                href="/terms"
                className="
                  flex
                  min-h-12
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border border-border/60
                  bg-background
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  transition
                  hover:bg-muted
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                "
              >
                利用規約

                <ChevronRight
                  aria-hidden="true"
                  className="size-4"
                />
              </Link>
            </div>
          </section>

          <div className="mt-10">
            <Link
              href="/"
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                rounded-full
                border border-border
                bg-card
                px-6
                text-sm
                font-semibold
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                motion-reduce:transform-none
              "
            >
              ホームへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
