import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "サウナライフプラットフォームTOTONOの利用条件について説明します。",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "利用規約｜TOTONO",
    description:
      "サウナライフプラットフォームTOTONOの利用条件について説明します。",
    url: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    id: "application",
    title: "第1条 適用",
    content: (
      <div className="space-y-4">
        <p>
          本利用規約（以下「本規約」といいます。）は、
          サウナライフプラットフォーム「TOTONO」
          （以下「本サービス」といいます。）の利用条件を定めるものです。
        </p>

        <p>
          本サービスを利用するすべての方
          （以下「利用者」といいます。）は、
          本規約の内容に同意したうえで本サービスを利用するものとします。
        </p>

        <p>
          本サービス内に、本規約とは別に個別のルール、
          ガイドライン、注意事項その他の定めが掲載されている場合、
          それらも本規約の一部を構成します。
        </p>
      </div>
    ),
  },
  {
    id: "service",
    title: "第2条 本サービスの内容",
    content: (
      <div className="space-y-4">
        <p>
          本サービスは、サウナ施設の発見、サ活の記録、
          利用者同士の交流その他サウナライフに関する機能を
          提供するサービスです。
        </p>

        <p>本サービスでは、主に以下の機能を提供します。</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>サウナ施設の検索および閲覧</li>
          <li>現在地周辺のサウナ施設検索</li>
          <li>サウナ施設の比較およびお気に入り登録</li>
          <li>サ活の投稿、記録、編集および削除</li>
          <li>画像の投稿</li>
          <li>コメント、いいね、ブックマーク</li>
          <li>フォローおよび通知</li>
          <li>サ活履歴、実績、ストリークなどの表示</li>
          <li>その他、運営者が提供する関連機能</li>
        </ul>

        <p>
          運営者は、本サービスの内容を追加、変更または終了することがあります。
        </p>
      </div>
    ),
  },
  {
    id: "registration",
    title: "第3条 利用登録",
    content: (
      <div className="space-y-4">
        <p>
          一部の機能を利用するためには、所定の方法による
          アカウント登録が必要です。
        </p>

        <p>
          利用者は、登録時および登録後を通じて、
          真実かつ正確な情報を提供するものとします。
        </p>

        <p>
          登録情報に変更が生じた場合、利用者は本サービス上の操作その他
          運営者が指定する方法により、速やかに情報を更新するものとします。
        </p>

        <p>
          運営者は、次のいずれかに該当すると判断した場合、
          登録を拒否または取り消すことがあります。
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>登録内容に虚偽、誤記または記載漏れがある場合</li>
          <li>過去に本規約違反などを理由として利用停止処分を受けた場合</li>
          <li>第三者になりすまして登録した場合</li>
          <li>反社会的勢力に該当する、または関係があると判断した場合</li>
          <li>その他、登録が適切でないと合理的に判断した場合</li>
        </ul>
      </div>
    ),
  },
  {
    id: "account",
    title: "第4条 アカウントの管理",
    content: (
      <div className="space-y-4">
        <p>
          利用者は、自らの責任においてメールアドレス、
          認証情報およびアカウントを適切に管理するものとします。
        </p>

        <p>
          利用者は、アカウントを第三者へ譲渡、貸与、共有、
          売買または担保設定してはなりません。
        </p>

        <p>
          アカウントの不正利用またはそのおそれを認識した場合、
          利用者は速やかに認証情報を変更し、
          運営者へ連絡するものとします。
        </p>

        <p>
          利用者の管理不十分、使用上の過誤または第三者の利用によって
          生じた損害について、運営者に故意または重大な過失がある場合を除き、
          運営者は責任を負わないものとします。
        </p>
      </div>
    ),
  },
  {
    id: "minor",
    title: "第5条 未成年者の利用",
    content: (
      <div className="space-y-4">
        <p>
          未成年者が本サービスを利用する場合は、
          親権者その他の法定代理人の同意を得たうえで
          本サービスを利用するものとします。
        </p>

        <p>
          未成年者が法定代理人の同意を得ずに本サービスを利用した場合、
          運営者は当該アカウントの利用を制限または停止することがあります。
        </p>
      </div>
    ),
  },
  {
    id: "posts",
    title: "第6条 投稿コンテンツ",
    content: (
      <div className="space-y-4">
        <p>
          利用者が本サービスへ投稿、送信または保存した文章、
          画像、評価、コメントその他の情報
          （以下「投稿コンテンツ」といいます。）について、
          利用者は、自ら投稿するために必要な権利を有していることを
          保証するものとします。
        </p>

        <p>
          投稿コンテンツに関する著作権その他の権利は、
          利用者または正当な権利者に帰属します。
        </p>

        <p>
          利用者は運営者に対し、本サービスの提供、維持、改善、
          宣伝、不正利用防止および投稿内容の表示に必要な範囲で、
          投稿コンテンツを無償で利用、複製、表示、配信、
          サイズ変更その他必要な処理を行うことを許諾します。
        </p>

        <p>
          この許諾は、投稿コンテンツを本サービスで提供するために
          必要な範囲に限られ、利用者の人格権や投稿内容を
          不当に侵害するものではありません。
        </p>

        <p>
          利用者は、第三者の著作権、肖像権、プライバシー、
          商標権その他の権利を侵害する投稿を行ってはなりません。
        </p>
      </div>
    ),
  },
  {
    id: "public-content",
    title: "第7条 投稿内容の公開",
    content: (
      <div className="space-y-4">
        <p>
          投稿コンテンツ、ユーザー名、プロフィール画像、
          自己紹介、コメント、評価その他の情報は、
          本サービス上で他の利用者またはインターネット上の
          閲覧者へ公開される場合があります。
        </p>

        <p>
          利用者は、住所、連絡先、本人確認書類、
          健康情報その他公開を希望しない情報を
          投稿コンテンツへ含めないよう注意するものとします。
        </p>

        <p>
          利用者が第三者を撮影した画像などを投稿する場合、
          必要に応じて当該第三者の同意を得るものとします。
        </p>
      </div>
    ),
  },
  {
    id: "prohibited",
    title: "第8条 禁止事項",
    content: (
      <div className="space-y-4">
        <p>
          利用者は、本サービスの利用にあたり、
          以下の行為を行ってはなりません。
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>法令、公序良俗または本規約に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>第三者になりすます行為</li>
          <li>虚偽または誤解を招く情報を意図的に投稿する行為</li>
          <li>他の利用者や施設関係者を誹謗中傷する行為</li>
          <li>差別、脅迫、嫌がらせまたは迷惑行為</li>
          <li>第三者の知的財産権、肖像権、プライバシーその他の権利を侵害する行為</li>
          <li>本人の同意なく個人情報を投稿または公開する行為</li>
          <li>わいせつ、暴力的、残虐または著しく不快な内容を投稿する行為</li>
          <li>自傷行為、危険行為または違法行為を助長する行為</li>
          <li>スパム、過度な宣伝、勧誘または営業行為</li>
          <li>不正アクセス、情報の改ざんまたはシステムへの攻撃</li>
          <li>ウイルスその他の有害なプログラムを送信する行為</li>
          <li>本サービスへ過度な負荷をかける行為</li>
          <li>自動化された手段により大量の情報を取得する行為</li>
          <li>本サービスの全部または一部を無断で複製、転売または再配布する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>反社会的勢力への利益供与その他の関与</li>
          <li>その他、運営者が不適切と合理的に判断する行為</li>
        </ul>
      </div>
    ),
  },
  {
    id: "facility-information",
    title: "第9条 サウナ施設情報",
    content: (
      <div className="space-y-4">
        <p>
          本サービスに掲載される施設名、所在地、営業時間、
          料金、設備、混雑状況、評価その他の施設情報は、
          利用者の投稿、公開情報、施設関係者からの提供情報などを
          もとに掲載される場合があります。
        </p>

        <p>
          運営者は、施設情報の正確性、完全性、最新性、
          有用性または特定目的への適合性を保証するものではありません。
        </p>

        <p>
          営業時間、料金、休館日、設備の利用可否その他の重要事項は、
          利用者自身で施設の公式情報などを確認してください。
        </p>

        <p>
          施設情報に誤りがある場合、利用者または施設関係者は、
          所定の方法により修正を依頼できます。
        </p>
      </div>
    ),
  },
  {
    id: "health",
    title: "第10条 健康および安全",
    content: (
      <div className="space-y-4">
        <p>
          本サービスで提供または投稿される情報は、
          医療上の診断、治療、助言その他の医療行為を
          目的としたものではありません。
        </p>

        <p>
          サウナ、水風呂、入浴その他の行為には、
          体調や持病などにより健康上の危険が生じる場合があります。
        </p>

        <p>
          利用者は、自身の体調、健康状態および施設の注意事項を確認し、
          自己の判断と責任において施設を利用してください。
        </p>

        <p>
          体調に不安がある場合、妊娠中の場合、
          持病がある場合または服薬中の場合は、
          必要に応じて医師などの専門家へ相談してください。
        </p>
      </div>
    ),
  },
  {
    id: "location-map",
    title: "第11条 位置情報および地図情報",
    content: (
      <div className="space-y-4">
        <p>
          本サービスでは、現在地周辺の施設検索などのため、
          利用者の許可に基づいて位置情報を利用する場合があります。
        </p>

        <p>
          地図上に表示される現在地、施設位置、距離、
          経路その他の情報には誤差が生じる場合があります。
        </p>

        <p>
          利用者は、実際の道路状況、交通規制、
          施設の案内その他の情報を確認したうえで行動してください。
        </p>

        <p>
          運転中や歩行中に端末を操作するなど、
          危険な方法で本サービスを利用してはなりません。
        </p>
      </div>
    ),
  },
  {
    id: "moderation",
    title: "第12条 投稿の確認および削除",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、投稿コンテンツが本規約に違反する場合、
          第三者の権利を侵害する場合、通報を受けた場合、
          または本サービスの運営上必要と合理的に判断した場合、
          投稿コンテンツを確認することがあります。
        </p>

        <p>
          運営者は、必要に応じて投稿コンテンツの非表示、削除、
          公開範囲の変更その他の措置を講じることがあります。
        </p>

        <p>
          緊急性がある場合や、法令違反、権利侵害、
          安全上の問題がある場合を除き、
          可能な範囲で利用者へ理由を説明するよう努めます。
        </p>
      </div>
    ),
  },
  {
    id: "suspension",
    title: "第13条 利用制限および登録抹消",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、利用者が以下のいずれかに該当する場合、
          事前の通知なく、本サービスの全部または一部の利用制限、
          投稿削除、アカウント停止または登録抹消を行うことがあります。
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>本規約に違反した場合</li>
          <li>登録情報に虚偽があることが判明した場合</li>
          <li>第三者の権利を侵害した場合</li>
          <li>本サービスへ重大な損害または危険を生じさせた場合</li>
          <li>不正アクセスや不正利用が疑われる場合</li>
          <li>運営者からの連絡に一定期間応答がない場合</li>
          <li>長期間利用がなく、アカウント維持が不要と合理的に判断した場合</li>
          <li>その他、本サービスの利用継続が適切でないと合理的に判断した場合</li>
        </ul>

        <p>
          運営者に故意または重大な過失がある場合を除き、
          本条に基づく措置により利用者へ生じた損害について、
          運営者は責任を負わないものとします。
        </p>
      </div>
    ),
  },
  {
    id: "withdrawal",
    title: "第14条 退会およびアカウント削除",
    content: (
      <div className="space-y-4">
        <p>
          利用者は、運営者が定める方法により、
          いつでも退会またはアカウント削除を申し込むことができます。
        </p>

        <p>
          退会後は、プロフィール、投稿、画像、コメント、
          お気に入りその他アカウントに関連する情報へ
          アクセスできなくなる場合があります。
        </p>

        <p>
          法令上の義務、不正利用への対応、紛争への対応、
          バックアップその他の正当な理由がある場合、
          一部の情報を必要な期間保持することがあります。
        </p>
      </div>
    ),
  },
  {
    id: "intellectual-property",
    title: "第15条 知的財産権",
    content: (
      <div className="space-y-4">
        <p>
          本サービスを構成するプログラム、デザイン、ロゴ、
          文章、画像、データベースその他のコンテンツに関する
          著作権、商標権その他の知的財産権は、
          運営者または正当な権利者に帰属します。
        </p>

        <p>
          利用者は、本規約で明示的に認められる場合を除き、
          運営者または権利者の許可なく、
          これらを複製、転載、改変、販売、配布、
          公衆送信その他の方法で利用してはなりません。
        </p>
      </div>
    ),
  },
  {
    id: "service-changes",
    title: "第16条 本サービスの変更・停止・終了",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、以下の場合、本サービスの全部または一部を
          変更、停止または終了することがあります。
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>システムの保守、点検または更新を行う場合</li>
          <li>通信回線、外部サービスまたは設備に障害が生じた場合</li>
          <li>地震、火災、停電、災害その他の不可抗力が生じた場合</li>
          <li>不正アクセスやセキュリティ上の問題へ対応する場合</li>
          <li>法令または行政機関の要請へ対応する場合</li>
          <li>事業上または運営上必要と合理的に判断した場合</li>
        </ul>

        <p>
          本サービスを終了する場合、運営者は、
          緊急の場合を除き、合理的な方法と期間で
          利用者へ事前に案内するよう努めます。
        </p>
      </div>
    ),
  },
  {
    id: "disclaimer",
    title: "第17条 保証の否認および免責",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、本サービスについて、事実上または法律上の
          瑕疵がないこと、常に正常に動作すること、
          利用者の特定の目的に適合すること、
          ならびに掲載情報が正確、完全かつ最新であることを
          保証するものではありません。
        </p>

        <p>
          利用者間、利用者と施設、利用者と第三者との間で生じた
          連絡、取引、紛争その他の問題は、
          当事者間で解決するものとします。
        </p>

        <p>
          運営者は、本サービスの利用または利用不能、
          投稿コンテンツ、施設情報、位置情報、
          外部サービスの障害などによって生じた損害について、
          運営者に故意または重大な過失がある場合を除き、
          責任を負わないものとします。
        </p>

        <p>
          運営者が責任を負う場合であっても、
          運営者の軽過失によって生じた損害に対する責任は、
          通常かつ直接の損害に限られるものとします。
          ただし、法令上この制限が認められない場合はこの限りではありません。
        </p>
      </div>
    ),
  },
  {
    id: "privacy",
    title: "第18条 個人情報等の取り扱い",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、本サービスの利用に伴って取得する
          個人情報および利用者情報を、別途定める
          プライバシーポリシーに従って取り扱います。
        </p>

        <p>
          利用者は、本サービスを利用する前に、
          プライバシーポリシーの内容を確認するものとします。
        </p>

        <Link
          href="/privacy"
          className="inline-flex rounded-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          プライバシーポリシーを確認する
        </Link>
      </div>
    ),
  },
  {
    id: "notifications",
    title: "第19条 利用者への連絡",
    content: (
      <div className="space-y-4">
        <p>
          運営者から利用者への連絡は、
          本サービス上の表示、登録されたメールアドレスへの送信
          その他運営者が適切と判断する方法で行います。
        </p>

        <p>
          利用者は、登録した連絡先を正確かつ最新の状態に
          保つものとします。
        </p>
      </div>
    ),
  },
  {
    id: "changes",
    title: "第20条 本規約の変更",
    content: (
      <div className="space-y-4">
        <p>
          運営者は、法令の変更、本サービスの内容変更、
          運営上の必要その他合理的な理由がある場合、
          本規約を変更することがあります。
        </p>

        <p>
          重要な変更を行う場合は、変更内容および効力発生日を、
          本サービス上の表示その他適切な方法で事前に案内します。
        </p>

        <p>
          変更後の本規約は、案内した効力発生日から適用されます。
        </p>
      </div>
    ),
  },
  {
    id: "assignment",
    title: "第21条 権利義務の譲渡",
    content: (
      <div className="space-y-4">
        <p>
          利用者は、運営者の事前の承諾なく、
          本規約上の地位または本規約に基づく権利義務を、
          第三者へ譲渡、移転、担保設定その他の処分をしてはなりません。
        </p>

        <p>
          運営者が本サービスに関する事業を第三者へ譲渡した場合、
          本規約上の地位、権利義務、登録情報その他の情報を、
          当該事業の譲受人へ承継させることがあります。
        </p>
      </div>
    ),
  },
  {
    id: "severability",
    title: "第22条 分離可能性",
    content: (
      <div className="space-y-4">
        <p>
          本規約のいずれかの条項またはその一部が、
          法令などにより無効または執行不能と判断された場合でも、
          残りの条項は引き続き有効とします。
        </p>
      </div>
    ),
  },
  {
    id: "governing-law",
    title: "第23条 準拠法および裁判管轄",
    content: (
      <div className="space-y-4">
        <p>
          本規約の成立、効力、履行および解釈には、
          日本法を適用します。
        </p>

        <p>
          本サービスまたは本規約に関して紛争が生じた場合、
          利用者と運営者は、まず誠実に協議して解決を図るものとします。
        </p>

        <p>
          協議によって解決できない場合、
          法令に別段の定めがある場合を除き、
          運営者の所在地を管轄する地方裁判所または簡易裁判所を
          第一審の専属的合意管轄裁判所とします。
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "第24条 お問い合わせ",
    content: (
      <div className="space-y-4">
        <p>
          本規約、本サービス、投稿削除、権利侵害その他の
          お問い合わせについては、本サービス内の
          お問い合わせページからご連絡ください。
        </p>

        <p>
          お問い合わせページは、正式公開までに本サービス内へ設置します。
        </p>
      </div>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
                利用規約
              </li>
            </ol>
          </nav>

          <header className="border-b border-border/70 pb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Terms of Service
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              利用規約
            </h1>

            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              TOTONOを安心して利用していただくためのルールと
              利用条件を定めています。
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
              本ページは、TOTONOの現在のサービス内容をもとに作成した
              利用規約の初稿です。正式公開前には、実際の運営者情報、
              お問い合わせ方法、アカウント削除方法、有料機能の有無、
              事業所在地および運用体制と内容が一致していることを
              確認してください。
            </p>
          </aside>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none"
            >
              ホームへ戻る
            </Link>

            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-transparent px-6 text-sm font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
