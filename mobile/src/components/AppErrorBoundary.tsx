import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";
import {
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

type AppErrorBoundaryProps = {
  children:
    ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  errorMessage:
    | string
    | null;
};

const INITIAL_STATE:
  AppErrorBoundaryState = {
    hasError:
      false,

    errorMessage:
      null,
  };

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state:
    AppErrorBoundaryState =
    INITIAL_STATE;

  static getDerivedStateFromError(
    error: unknown
  ): AppErrorBoundaryState {
    return {
      hasError:
        true,

      errorMessage:
        error instanceof
          Error
          ? error.message
          : "予期しないエラーが発生しました。",
    };
  }

  componentDidCatch(
    error: unknown,
    errorInfo: ErrorInfo
  ) {
    if (
      import.meta.env.DEV
    ) {
      console.error(
        "TOTONO rendering error",
        error,
        errorInfo
      );
    }
  }

  handleRetry = () => {
    this.setState(
      INITIAL_STATE
    );
  };

  handleReload = () => {
    window.location
      .reload();
  };

  render() {
    if (
      !this.state
        .hasError
    ) {
      return (
        this.props
          .children
      );
    }

    return (
      <main className="app-fatal-error-screen">
        <section
          className="app-fatal-error-card"
          role="alert"
        >
          <div className="app-fatal-error-icon">
            <TriangleAlert
              aria-hidden="true"
            />
          </div>

          <p className="eyebrow">
            Something went wrong
          </p>

          <h1>
            TOTONOを
            表示できませんでした
          </h1>

          <p className="lead">
            一時的な問題が
            発生した可能性があります。
            もう一度お試しください。
          </p>

          {import.meta.env.DEV &&
          this.state
            .errorMessage ? (
            <p className="app-fatal-error-message">
              {
                this.state
                  .errorMessage
              }
            </p>
          ) : null}

          <button
            type="button"
            className="app-fatal-error-primary"
            onClick={
              this.handleReload
            }
          >
            <RefreshCw
              aria-hidden="true"
            />

            アプリを再読み込み
          </button>

          <button
            type="button"
            className="secondary app-fatal-error-secondary"
            onClick={
              this.handleRetry
            }
          >
            画面をもう一度表示
          </button>
        </section>
      </main>
    );
  }
}
