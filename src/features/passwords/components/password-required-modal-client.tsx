"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useState, useTransition } from "react";
import { validatePasswordAction } from "../actions/actions";
import { removeAllWhitespace } from "@/lib/utils";
import { toast } from "sonner";

export const PasswordRequiredModalClient = () => {
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const validatePassword = () => {
    if (!password.trim()) return toast.error("Please enter a password.");
    startTransition(async () => {
      const response = await validatePasswordAction(
        removeAllWhitespace(password),
      );
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Hold your brain juices.</DialogTitle>
          <DialogDescription>
            To continue onward, you must enter a valid password given to you by
            one of our administrators.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold text-center">
            Hold your brain juices.
          </h1>
          <p className="text-base text-muted-foreground text-center">
            To continue onward, you must enter a valid password given to you by
            one of our administrators.
          </p>
          <Input
            value={removeAllWhitespace(password)}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password here, note that casing DOES matter."
          />
          <Button
            className="w-full"
            disabled={isPending}
            onClick={validatePassword}
          >
            <LoadingSwap isLoading={isPending}>Validate Password</LoadingSwap>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
