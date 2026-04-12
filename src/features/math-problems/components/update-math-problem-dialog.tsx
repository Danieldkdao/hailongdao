"use client";

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

type UpdateMathProblemDialogProps = {
  open: boolean;
  setOpen: Setter<boolean>;
  data: GetUserMathProblemsType[number];
};

export const UpdateMathProblemDialog = ({
  open,
  setOpen,
  data,
}: UpdateMathProblemDialogProps) => {
  const router = useRouter();
  const { keywords, ...mathProblem } = data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[calc(100%-2rem)] w-full max-w-[98%] flex-col overflow-y-auto sm:max-w-[98%]">
        <DialogHeader>
          <DialogTitle>Update Problem</DialogTitle>
          <DialogDescription>Edit the problem details.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full overflow-visible">
          <CreateUpdateProblemForm
            mathProblem={mathProblem}
            onFinish={() => {
              router.refresh();
              setOpen(false);
            }}
            keywords={keywords}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
