import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "TOTONOにおける個人情報および利用者情報の取り扱いについて説明します。",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "プライバシーポリシー｜TOTONO",
    description:
      "TOTONOにおける個人情報および利用者情報の取り扱いについて説明します。",
    url: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    id: "operator",
    title: "1. 運営者について",
    content: (
      <div className="space-y-4">
        <p>
          本プライバシーポリシーは、サウナライフプラットフォーム
          「TOTONO」（以下「本サービス」といいます。）における、
          利用者に関する情報の取り扱いについて定めるものです。
        </p>

        <dl className="grid gap-3 rounded-2xl border border-border/60 bg-background/60 p-5 sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-foreground">
            サービス名
          </dt>
          <dd>TOTONO</dd>

          <dt className="font-semibold text-foreground">
            運営者
          </dt>
          <dd>TOTONO運営者</dd>

          <dt className="font-semibold text-foreground">
            お問い合わせ
          </dt>
          <dd>
            本サービス内のお問い合わせページからご連絡ください。
          </dd>
        </dl>
      </div>
    ),
  },
  {
    id: "information",
    title: "2. 取得する情報",
    content: (
      <div className="space-y-5">
        <p>
          本サービスでは、サービスの提供および改善のため、
          以下の情報を取得する場合があります。
        </p>

        <div>
          <h3 className="font-semibold text-foreground">
            アカウントおよびプロフィール情報
          </h3>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>メールアドレス</li>
            <li>ユーザー名</li>
            <li>プロフィール画像</li>
            <li>自己紹介文</li>
            <li>アカウント識別子</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">
            本サービスへの投稿・活動情報
          </h3>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>サウナ施設名および訪問日</li>
            <li>セット数、評価、コメント</li>
            <li>投稿画像</li>
            <li>いいね、コメント、ブックマーク</li>
            <li>フォローおよびフォロワー情報</li>
            <li>お気に入りに登録したサウナ施設</li>
            <li>サ活記録、実績、ストリークなどの利用履歴</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">
            位置情報
          </h3>

          <p className="mt-3">
            現在地周辺のサウナ施設を検索する機能を利用した場合、
            端末から緯度および経度を取得することがあります。
          </p>

          <p className="mt-3">
            位置情報は、利用者がブラウザまたは端末上で明示的に
            許可した場合に限り取得します。
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">
            端末・アクセス情報
          </h3>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>IPアドレス</li>
            <li>ブラウザや端末の種類</li>
            <li>OSおよび言語設定</li>
            <li>アクセス日時</li>
            <li>参照元URL</li>
            <li>本サービス内の閲覧・操作履歴</li>
            <li>Cookieその他の識別情報</li>
            <li>エラーおよび障害に関するログ</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">
            お問い合わせ情報
          </h3>

          <p className="mt-3">
            お問い合わせ、不具合報告、投稿や施設情報の修正依頼などの際に、
            氏名、メールアドレス、お問い合わせ内容その他利用者が
            提供した情報を取得することがあります。
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "purpose",
    title: "3. 情報の利用目的",
    content: (
      <div className="space-y-4">
        <p>
          取得した情報は、以下の目的で利用します。
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>本サービスの提供、維持および運営のため</li>
          <li>本人確認およびアカウント管理のため</li>
          <li>サウナ施設の検索・推薦機能を提供するため</li>
          <li>現在地周辺のサウナ施設を表示するため</li>
          <li>投稿、コメント、いいね、フォローなどの機能を提供するため</li>
          <li>利用状況やサ活記録を可視化するため</li>
          <li>通知を表示または送信するため</li>
          <li>お問い合わせや不具合報告に対応するため</li>
          <li>不正利用、迷惑行為および規約違反を防止するため</li>
          <li>本サービスの品質、利便性および安全性を改善するため</li>
          <li>アクセス状況や利用傾向を分析するため</li>
          <li>障害調査およびセキュリティ対策を行うため</li>
          <li>重要なお知らせや規約変更を案内するため</li>
          <li>法令上必要となる対応を行うため</li>
        </ul>
      </div>
    ),
  },
  {
    id: "location",
    title: "4. 位置情報の取り扱い",
    content: (
      <div className="space-y-4">
        <p>
          本サービスでは、利用者の現在地周辺にあるサウナ施設を
          検索・表示する目的で、位置情報を利用する場合があります。
        </p>

        <p>
          位置情報は、ブラウザまたは端末の許可設定に基づいて取得されます。
          利用者は、ブラウザまたは端末の設定から、いつでも位置情報の
          利用を拒否または停止できます。
        </p>

        <p>
          位置情報の利用を許可しない場合でも、本サービスのその他の機能は
          利用できます。ただし、現在地検索など一部の機能を利用できない
          場合があります。
        </p>
      </div>
    ),
  },
  {
    id: "public-information",
    title: "5. 公開される情報",
    content: (
      <div className="space-y-4">
        <p>
          本サービスに投稿された情報のうち、以下の情報は、
          他の利用者またはインターネット上の閲覧者に公開される場合があります。
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>ユーザー名</li>
          <li>プロフィール画像および自己紹介</li>
          <li>サ活投稿および投稿画像</li>
          <li>施設への評価およびコメント</li>
          <li>いいね、コメント、フォローなどの活動情報</li>
          <li>公開プロフィールおよび公開範囲に設定された利用履歴</li>
        </ul>

        <p>
          投稿する際は、本人または第三者を特定できる情報、住所、
          連絡先その他公開を希望しない情報を含めないようご注意ください。
        </p>
      </div>
    ),
  },
  {
    id: "third-party",
    title: "6. 第三者への提供",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、次の場合を除き、本人の同意なく個人データを
          第三者へ提供しません。
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>法令に基づく場合</li>
          <li>
            人の生命、身体または財産を保護するために必要であり、
            本人の同意を得ることが困難な場合
          </li>
          <li>
            公衆衛生の向上または児童の健全な育成のために特に必要であり、
            本人の同意を得ることが困難な場合
          </li>
          <li>
            国または地方公共団体などが法令上の事務を遂行することに
            協力する必要がある場合
          </li>
          <li>
            利用目的の達成に必要な範囲で、情報の取り扱いを
            外部事業者へ委託する場合
          </li>
          <li>
            事業の承継に伴って情報が提供される場合
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "external-services",
    title: "7. 外部サービスの利用",
    content: (
      <div className="space-y-4">
        <p>
          本サービスでは、サービス提供、データ保管、認証、
          配信、アクセス解析およびエラー監視などのため、
          外部サービスを利用する場合があります。
        </p>

        <div className="overflow-hidden rounded-2xl border border-border/60">
          <div className="grid gap-px bg-border/60 sm:grid-cols-[12rem_1fr]">
            <div className="bg-background p-4 font-semibold text-foreground">
              Supabase
            </div>
            <div className="bg-background p-4">
              認証、データベースおよび画像などのファイル保管
            </div>

            <div className="bg-background p-4 font-semibold text-foreground">
              Vercel
            </div>
            <div className="bg-background p-4">
              本サービスの配信、ホスティングおよび稼働状況の把握
            </div>

            <div className="bg-background p-4 font-semibold text-foreground">
              地図サービス
            </div>
            <div className="bg-background p-4">
              地図およびサウナ施設の位置情報の表示
            </div>

            <div className="bg-background p-4 font-semibold text-foreground">
              分析・監視サービス
            </div>
            <div className="bg-background p-4">
              利用状況の分析、性能測定およびエラー調査
            </div>
          </div>
        </div>

        <p>
          各外部サービスにおける情報の取り扱いについては、
          各サービス提供事業者のプライバシーポリシーが適用される
          場合があります。
        </p>
      </div>
    ),
  },
  {
    id: "cookies",
    title: "8. Cookieおよびアクセス解析",
    content: (
      <div className="space-y-4">
        <p>
          本サービスでは、ログイン状態の維持、設定情報の保存、
          利便性の向上、利用状況の分析および不正利用の防止などを目的として、
          Cookieまたはこれに類する技術を利用する場合があります。
        </p>

        <p>
          利用者はブラウザの設定によりCookieを無効にできます。
          ただし、Cookieを無効にすると、ログインを含む本サービスの
          一部機能を利用できない場合があります。
        </p>
      </div>
    ),
  },
  {
    id: "security",
    title: "9. 安全管理措置",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、取得した情報への不正アクセス、漏えい、滅失、
          改ざんその他の事故を防止するため、必要かつ適切な
          安全管理措置を講じるよう努めます。
        </p>

        <p>
          また、外部事業者へ情報の取り扱いを委託する場合は、
          委託先を適切に選定し、必要に応じてその取り扱い状況を
          確認します。
        </p>
      </div>
    ),
  },
  {
    id: "retention",
    title: "10. 情報の保存期間",
    content: (
      <div className="space-y-4">
        <p>
          取得した情報は、利用目的の達成に必要な期間、
          または法令上保存が必要となる期間に限り保有します。
        </p>

        <p>
          利用目的を達成し、保有する必要がなくなった情報は、
          法令および運用上必要となる範囲を除き、
          適切な方法で削除または匿名化します。
        </p>
      </div>
    ),
  },
  {
    id: "rights",
    title: "11. 開示・訂正・削除・利用停止",
    content: (
      <div className="space-y-4">
        <p>
          利用者は、本サービス上で編集可能なプロフィール情報や
          投稿内容を、自ら確認、変更または削除できます。
        </p>

        <p>
          保有する個人データについて、開示、訂正、追加、削除、
          利用停止、消去または第三者提供の停止を希望する場合は、
          お問い合わせページからご連絡ください。
        </p>

        <p>
          ご依頼を受けた場合は、本人確認を行ったうえで、
          法令に基づき合理的な期間および範囲で対応します。
        </p>
      </div>
    ),
  },
  {
    id: "account-deletion",
    title: "12. アカウントの削除",
    content: (
      <div className="space-y-4">
        <p>
          利用者は、所定の方法によりアカウントの削除を依頼できます。
        </p>

        <p>
          アカウントを削除した場合、プロフィールや投稿など、
          アカウントに関連する情報が削除されることがあります。
          ただし、法令上の義務、不正利用への対応、紛争への対応、
          バックアップその他正当な理由により、一定期間情報が
          保持される場合があります。
        </p>

        <p>
          他の利用者との関係で保存が必要な情報や、個人を特定できない
          状態に加工した統計情報は、削除後も保持される場合があります。
        </p>
      </div>
    ),
  },
  {
    id: "children",
    title: "13. 未成年者の利用",
    content: (
      <div className="space-y-4">
        <p>
          未成年者が本サービスを利用する場合は、必要に応じて
          親権者その他の法定代理人の同意を得たうえで利用してください。
        </p>
      </div>
    ),
  },
  {
    id: "changes",
    title: "14. 本ポリシーの変更",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、法令の変更、本サービスの内容変更その他必要に応じて、
          本ポリシーを変更することがあります。
        </p>

        <p>
          重要な変更を行う場合は、本サービス上での表示その他適切な方法で
          利用者へお知らせします。
        </p>

        <p>
          変更後の本ポリシーは、本サービス上へ掲載した時点、
          または別途定めた施行日から効力を生じます。
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "15. お問い合わせ",
    content: (
      <div className="space-y-4">
        <p>
          本ポリシー、個人情報の取り扱い、情報の開示・削除、
          アカウント削除その他のお問い合わせについては、
          お問い合わせページからご連絡ください。
        </p>

        <p>
          お問い合わせページは、正式公開までに本サービス内へ設置します。
        </p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <nav
            aria-label="パンくずリスト"
            className="mb-8 text-sm text-muted-foreground"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  ホーム
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li aria-current="page">
                プライバシーポリシー
              </li>
            </ol>
          </nav>

          <header className="border-b border-border/70 pb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Privacy Policy
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              プライバシーポリシー
            </h1>

            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              TOTONOは、利用者の情報を大切に取り扱い、
              安心してサウナライフを記録・発見できるサービスを目指します。
            </p>

            <dl className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-[7rem_1fr]">
              <dt className="font-medium text-foreground">
                制定日
              </dt>
              <dd>2026年8月2日</dd>

              <dt className="font-medium text-foreground">
                最終更新日
              </dt>
              <dd>2026年8月2日</dd>
            </dl>
          </header>

          <div className="mt-10 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-semibold">
              目次
            </h2>

            <ol className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex rounded-sm leading-6 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-24 border-b border-border/60 pb-12 last:border-b-0"
              >
                <h2
                  id={`${section.id}-heading`}
                  className="text-xl font-semibold tracking-tight sm:text-2xl"
                >
                  {section.title}
                </h2>

                <div className="mt-5 text-[0.95rem] leading-8 text-muted-foreground sm:text-base">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <aside className="mt-14 rounded-3xl border border-border/60 bg-muted/40 p-6 text-sm leading-7 text-muted-foreground sm:p-8">
            <p>
              本ページは、TOTONOの現在のサービス内容をもとに作成しています。
              正式公開前には、実際に導入するアクセス解析・監視サービス、
              運営者情報、お問い合わせ方法およびアカウント削除方法と
              内容が一致していることを確認してください。
            </p>
          </aside>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none"
            >
              ホームへ戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
