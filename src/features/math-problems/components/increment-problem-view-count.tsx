"use client";

import { useEffect, useRef } from "react";
import { incrementMathProblemViewCount } from "../actions/actions";
import { useRouter } from "next/navigation";

export const IncrementProblemViewCount = ({
  mathProblemId,
}: {
  mathProblemId: string;
}) => {
  const initialRenderRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (initialRenderRef.current) return;
    initialRenderRef.current = true;
    incrementMathProblemViewCount(mathProblemId).then(() => router.refresh());
  }, []);

  return null;
};
