"use client";

import { useDebouncedValue } from "@tanstack/react-pacer";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

type SearchInputProps = {
  value: string;
  className?: string;
  placeholder: string;
  onSearchAction: (value: string) => void;
};

export const SearchInput = ({
  value,
  className,
  placeholder,
  onSearchAction,
}: SearchInputProps) => {
  const [search, setSearch] = useState(value);

  const debouncedSearchValue = useDebouncedValue(search, { wait: 1250 });

  useEffect(() => {
    onSearchAction(search);
  }, [debouncedSearchValue["0"]]);

  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};
