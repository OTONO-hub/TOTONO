import Link from "next/link";

const footerLinks = [
  {
    href: "/privacy",
    label: "プライバシーポリシー",
  },
  {
    href: "/terms",
    label: "利用規約",
  },
  {
    href: "/contact",
    label: "お問い合わせ",
  },
] as const;

const OPENSTREETMAP_COPYRIGHT_URL =
  "https://www.openstreetmap.org/copyright";

const ODBL_LICENSE_URL =
  "https://opendatacommons.org/licenses/odbl/1-0/";

export function SiteFooter() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer
      className="
        border-t
        border-border/60
        bg-card/60
        text-foreground
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          gap-8
          px-5
          py-10
          sm:px-8
          lg:flex-row
          lg:items-end
          lg:justify-between
          lg:py-12
        "
      >
        <div className="max-w-xl">
          <Link
            href="/"
            aria-label="TOTONO ホーム"
            className="
              inline-flex
              rounded-sm
              text-xl
              font-semibold
              tracking-[-0.04em]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
            "
          >
            TOTONO
          </Link>

          <p
            className="
              mt-3
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            サウナへ行く前から、整い始める。
            <br />
            発見・記録・つながりをひとつにする、
            サウナライフプラットフォーム。
          </p>
        </div>

        <div
          className="
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-end
            sm:justify-between
            lg:flex-col
            lg:items-end
          "
        >
          <nav aria-label="フッターナビゲーション">
            <ul
              className="
                flex
                flex-wrap
                gap-x-5
                gap-y-3
                text-sm
              "
            >
              {footerLinks.map(
                (
                  link
                ) => (
                  <li
                    key={
                      link.href
                    }
                  >
                    <Link
                      href={
                        link.href
                      }
                      className="
                        rounded-sm
                        text-muted-foreground
                        transition-colors
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring
                        focus-visible:ring-offset-2
                      "
                    >
                      {
                        link.label
                      }
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div
            className="
              space-y-1
              text-xs
              leading-6
              text-muted-foreground
              lg:text-right
            "
          >
            <p>
              施設データの一部 ©{" "}
              <a
                href={
                  OPENSTREETMAP_COPYRIGHT_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  rounded-sm
                  underline
                  underline-offset-4
                  transition-colors
                  hover:text-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                "
              >
                OpenStreetMap contributors
              </a>
              {" "}・{" "}
              <a
                href={
                  ODBL_LICENSE_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  rounded-sm
                  underline
                  underline-offset-4
                  transition-colors
                  hover:text-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                "
              >
                ODbL
              </a>
            </p>

            <p>
              © {currentYear} TOTONO
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
