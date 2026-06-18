import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordTable } from "@/db/schema";
import { getInputErrorStyle, removeAllWhitespace } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPasswordAction, updatePasswordAction } from "../actions/actions";
import { passwordSchema, PasswordSchemaType } from "../actions/schemas";

export const PasswordForm = ({
  existingPassword,
  afterAction,
}: {
  existingPassword?: typeof PasswordTable.$inferSelect;
  afterAction?: () => void;
}) => {
  const router = useRouter();
  const form = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: existingPassword ? existingPassword.password : "",
    },
  });

  const createUpdatePassword = async (data: PasswordSchemaType) => {
    const action = existingPassword
      ? updatePasswordAction(existingPassword.id, data)
      : createPasswordAction(data);
    const response = await action;
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      form.reset();
      router.refresh();
      afterAction?.();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(createUpdatePassword)}
      className="w-full flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="password"
        render={({ field: { value, ...props }, fieldState }) => (
          <Field>
            <FieldContent>
              <Input
                {...props}
                value={removeAllWhitespace(value)}
                className={getInputErrorStyle(fieldState.error)}
                placeholder="Enter a memorable password here..."
              />
            </FieldContent>
            <FieldDescription>
              Note that passwords must be unique so if you get an error, try
              checking if you already have a password with that name. No
              whitespace is allowed.
            </FieldDescription>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button disabled={form.formState.isSubmitting}>
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          {existingPassword ? "Save changes" : "Create"}
        </LoadingSwap>
      </Button>
    </form>
  );
};
