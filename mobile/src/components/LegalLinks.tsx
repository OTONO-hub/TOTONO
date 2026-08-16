import {
  useState,
} from "react";
import {
  ExternalLink,
  FileText,
  ShieldCheck,
} from "lucide-react";

import {
  openPrivacyPolicy,
  openTermsOfService,
} from "../services/legal-links";

type LegalPage =
  | "privacy"
  | "terms";

export function LegalLinks() {
  const [
    openingPage,
    setOpeningPage,
  ] =
    useState<
      LegalPage | null
    >(
      null
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<
      string | null
    >(
      null
    );

  async function handleOpen(
    page: LegalPage
  ) {
    if (openingPage) {
      return;
    }

    setOpeningPage(
      page
    );

    setErrorMessage(
      null
    );

    try {
      if (
        page ===
        "privacy"
      ) {
        await openPrivacyPolicy();
      } else {
        await openTermsOfService();
      }
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ページを開けませんでした。"
      );
    } finally {
      setOpeningPage(
        null
      );
    }
  }

  return (
    <section
      className="legal-links"
      aria-labelledby="legal-links-heading"
    >
      <div className="legal-links-heading">
        <p className="eyebrow">
          Legal
        </p>

        <h2 id="legal-links-heading">
          規約とポリシー
        </h2>
      </div>

      <div className="legal-links-list">
        <button
          type="button"
          className="legal-link-button"
          onClick={() => {
            void handleOpen(
              "privacy"
            );
          }}
          disabled={
            Boolean(
              openingPage
            )
          }
        >
          <span className="legal-link-icon legal-link-icon-privacy">
            <ShieldCheck
              aria-hidden="true"
            />
          </span>

          <span className="legal-link-content">
            <strong>
              プライバシーポリシー
            </strong>

            <small>
              個人情報の取り扱いについて
            </small>
          </span>

          <span className="legal-link-action">
            {openingPage ===
            "privacy"
              ? "開いています..."
              : "開く"}

            <ExternalLink
              aria-hidden="true"
            />
          </span>
        </button>

        <button
          type="button"
          className="legal-link-button"
          onClick={() => {
            void handleOpen(
              "terms"
            );
          }}
          disabled={
            Boolean(
              openingPage
            )
          }
        >
          <span className="legal-link-icon legal-link-icon-terms">
            <FileText
              aria-hidden="true"
            />
          </span>

          <span className="legal-link-content">
            <strong>
              利用規約
            </strong>

            <small>
              TOTONOのご利用条件
            </small>
          </span>

          <span className="legal-link-action">
            {openingPage ===
            "terms"
              ? "開いています..."
              : "開く"}

            <ExternalLink
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      {errorMessage ? (
        <p
          className="legal-links-error"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
