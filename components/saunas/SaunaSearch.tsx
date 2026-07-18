"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  searchSaunas,
  type Sauna,
} from "@/services/saunas";

type SaunaSearchProps = {
  selectedSauna: Sauna | null;
  onSelectSauna: (sauna: Sauna | null) => void;
  inputId?: string;
  required?: boolean;
};

const SEARCH_DELAY = 300;
const MIN_SEARCH_LENGTH = 1;

export function SaunaSearch({
  selectedSauna,
  onSelectSauna,
  inputId = "sauna-search",
  required = false,
}: SaunaSearchProps) {
  const [supabase] = useState(() => createClient());

  const containerRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState(
    selectedSauna?.name ?? ""
  );
  const [results, setResults] = useState<Sauna[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedKeyword = keyword.trim();

  const hasValidKeyword =
    trimmedKeyword.length >= MIN_SEARCH_LENGTH;

  const isSelectedSaunaName =
    selectedSauna !== null &&
    trimmedKeyword === selectedSauna.name;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (!hasValidKeyword || isSelectedSaunaName) {
      return;
    }

    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setErrorMessage("");

      try {
        const saunaResults = await searchSaunas(
          supabase,
          trimmedKeyword
        );

        if (!isActive) {
          return;
        }

        setResults(saunaResults);
        setIsOpen(true);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          "施設の検索中にエラーが発生しました。",
          error
        );

        setResults([]);
        setIsOpen(true);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "施設の検索中にエラーが発生しました。"
        );
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DELAY);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [
    hasValidKeyword,
    isSelectedSaunaName,
    supabase,
    trimmedKeyword,
  ]);

  const handleKeywordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const nextKeyword = event.target.value;

    setKeyword(nextKeyword);
    setResults([]);
    setErrorMessage("");
    setIsOpen(false);

    if (
      selectedSauna &&
      nextKeyword.trim() !== selectedSauna.name
    ) {
      onSelectSauna(null);
    }
  };

  const handleSelectSauna = (sauna: Sauna) => {
    setKeyword(sauna.name);
    setResults([]);
    setIsOpen(false);
    setErrorMessage("");

    onSelectSauna(sauna);
  };

  const handleFocus = () => {
    if (
      hasValidKeyword &&
      !selectedSauna &&
      (results.length > 0 || errorMessage)
    ) {
      setIsOpen(true);
    }
  };

  const shouldShowResults =
    isOpen &&
    hasValidKeyword &&
    !selectedSauna;

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-[#3e3a3a]"
      >
        サウナ施設

        {required && (
          <span className="ml-1 text-[#e95884]">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          value={keyword}
          onChange={handleKeywordChange}
          onFocus={handleFocus}
          placeholder="施設名を入力してください"
          autoComplete="off"
          required={required}
          aria-label="サウナ施設を検索"
          aria-autocomplete="list"
          aria-expanded={shouldShowResults}
          aria-controls={`${inputId}-results`}
          aria-haspopup="listbox"
          className="
            w-full rounded-2xl
            border border-black/10
            bg-white px-4 py-3 pr-12
            text-[#3e3a3a]
            outline-none
            transition
            placeholder:text-[#3e3a3a]/40
            focus:border-[#3e3a3a]/40
            focus:ring-4
            focus:ring-[#9fd9f6]/30
          "
        />

        {isSearching && (
          <div
            aria-label="施設を検索中"
            className="
              absolute right-4 top-1/2
              h-5 w-5
              -translate-y-1/2
              animate-spin
              rounded-full
              border-2
              border-[#3e3a3a]/20
              border-t-[#3e3a3a]
            "
          />
        )}
      </div>

      {selectedSauna && (
        <div
          className="
            mt-2 flex items-center gap-2
            text-sm text-[#3e3a3a]/70
          "
        >
          <span
            aria-hidden="true"
            className="
              inline-flex h-5 w-5
              items-center justify-center
              rounded-full
              bg-[#00b4b6]/15
              text-xs font-bold
              text-[#007f81]
            "
          >
            ✓
          </span>

          <span>施設を選択済みです</span>
        </div>
      )}

      {shouldShowResults && (
        <div
          id={`${inputId}-results`}
          role="listbox"
          aria-label="サウナ施設の検索候補"
          className="
            absolute z-50 mt-2
            max-h-72 w-full
            overflow-y-auto
            rounded-2xl
            border border-black/10
            bg-white p-2
            shadow-xl shadow-black/10
          "
        >
          {errorMessage ? (
            <p
              role="alert"
              className="px-3 py-4 text-sm text-[#e95884]"
            >
              {errorMessage}
            </p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((sauna) => {
                const location = [
                  sauna.prefecture,
                  sauna.city,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <li
                    key={sauna.id}
                    role="presentation"
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() =>
                        handleSelectSauna(sauna)
                      }
                      className="
                        w-full rounded-xl
                        px-3 py-3
                        text-left
                        transition
                        hover:bg-[#e6e5ef]/70
                        focus:bg-[#e6e5ef]/70
                        focus:outline-none
                      "
                    >
                      <span
                        className="
                          block font-medium
                          text-[#3e3a3a]
                        "
                      >
                        {sauna.name}
                      </span>

                      {location && (
                        <span
                          className="
                            mt-1 block
                            text-xs
                            text-[#3e3a3a]/55
                          "
                        >
                          {location}
                        </span>
                      )}

                      {!location && sauna.address && (
                        <span
                          className="
                            mt-1 block
                            text-xs
                            text-[#3e3a3a]/55
                          "
                        >
                          {sauna.address}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-5">
              <p className="text-sm font-medium text-[#3e3a3a]">
                該当する施設が見つかりませんでした
              </p>

              <p
                className="
                  mt-1 text-xs leading-5
                  text-[#3e3a3a]/55
                "
              >
                別の施設名や短いキーワードで検索してください。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
