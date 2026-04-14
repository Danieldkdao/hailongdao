"use client";

import { useEffect } from "react";
import { Setter } from "@/lib/types";
import { GetUserMathProblemsType } from "../actions/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateUpdateProblemForm } from "./create-update-problem-form";
import { useRouter } from "next/navigation";
import { KeywordTable } from "@/db/schema";

type UpdateMathProblemDialogProps = {
  open: boolean;
  setOpen: Setter<boolean>;
  mathProblem: GetUserMathProblemsType[number];
  keywords: (typeof KeywordTable.$inferSelect)[];
};

export const UpdateMathProblemDialog = ({
  open,
  setOpen,
  mathProblem,
  keywords,
}: UpdateMathProblemDialogProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    return () => {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("pointer-events");
      document.body.style.removeProperty("padding-right");
      document.body.style.removeProperty("margin-right");
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[calc(100%-2rem)] w-full max-w-[98%] flex-col overflow-y-auto sm:max-w-[98%]">
        <DialogHeader>
          <DialogTitle>Update Problem</DialogTitle>
          <DialogDescription>Edit the problem details.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full overflow-visible">
          <CreateUpdateProblemForm
            mathProblem={{
              ...mathProblem,
              keywords: mathProblem.keywords.map((k) => k.keyword),
            }}
            onFinish={() => {
              router.refresh();
              setOpen(false);
            }}
            keywords={keywords.map((k) => ({ id: k.id, keyword: k.keyword }))}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
