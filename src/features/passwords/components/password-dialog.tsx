"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordTable } from "@/db/schema";
import { ReactNode, useState } from "react";
import { PasswordForm } from "./password-form";

export const PasswordDialog = ({
  children,
  existingPassword,
}: {
  children: ReactNode;
  existingPassword?: typeof PasswordTable.$inferSelect;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {existingPassword ? "Update Password" : "Create Password"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {existingPassword ? "Update Password" : "Create Password"}
          </DialogDescription>
        </DialogHeader>
        <PasswordForm
          existingPassword={existingPassword}
          afterAction={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
