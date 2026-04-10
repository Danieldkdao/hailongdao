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

type UpdateMathProblemDialogProps = {
  open: boolean;
  setOpen: Setter<boolean>;
  mathProblem: GetUserMathProblemsType[number];
};

export const UpdateMathProblemDialog = ({
  open,
  setOpen,
  mathProblem,
}: UpdateMathProblemDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col w-full max-w-[98%] sm:max-w-[98%]">
        <DialogHeader>
          <DialogTitle>Update Problem</DialogTitle>
          <DialogDescription>Edit the problem details.</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto flex-1 w-full">
          <CreateUpdateProblemForm
            mathProblem={mathProblem}
            onFinish={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
