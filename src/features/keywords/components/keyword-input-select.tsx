"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type KeywordInputSelectProps = {
  keywords: { id: string; keyword: string }[];
  values: string[];
  onChange: (values: string[]) => void;
};

export const KeywordInputSelect = ({
  keywords,
  values,
  onChange,
}: KeywordInputSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const filteredKeywords = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase();

    return keywords
      .filter((keyword) => {
        if (values.includes(keyword.keyword)) return false;
        if (!normalizedQuery) return true;
        return keyword.keyword.includes(normalizedQuery);
      })
      .slice(0, 10);
  }, [keywords, query, values]);

  const addKeyword = (keyword: string) => {
    if (values.includes(keyword)) return;

    onChange([...values, keyword]);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search keywords or press 'Enter'/'Return' to add a new one."
        onKeyDown={(e) => {
          const newKeyword = query.trim().toUpperCase();

          if (e.key === "Escape") {
            setOpen(false);
            return;
          }

          if (
            (e.key === "Return" || e.key === "Enter") &&
            newKeyword &&
            !values.includes(newKeyword)
          ) {
            e.preventDefault();
            addKeyword(newKeyword);
          }
        }}
      />

      {open && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5">
          <div className="max-h-56 overflow-y-auto p-1">
            {filteredKeywords.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No keywords found.
              </div>
            ) : (
              filteredKeywords.map((keyword) => (
                <button
                  key={keyword.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addKeyword(keyword.keyword)}
                >
                  {keyword.keyword}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
