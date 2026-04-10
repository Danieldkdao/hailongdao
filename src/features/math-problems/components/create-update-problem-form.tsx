"use client";

import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MathProblemStatus, mathProblemStatuses } from "@/db/schema";
import { errorBorder } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createMathProblem, updateMathProblem } from "../actions/actions";
import {
  createMathProblemSchema,
  CreateMathProblemSchemaType,
} from "../actions/schemas";
import { getMathProblemStatus } from "./math-problem-list-table";

export const CreateUpdateProblemForm = ({
  mathProblem,
  onFinish,
}: {
  mathProblem?: {
    id: string;
    title: string;
    status: MathProblemStatus;
    content: string;
  };
  onFinish?: () => void;
}) => {
  const form = useForm<CreateMathProblemSchemaType>({
    resolver: zodResolver(createMathProblemSchema),
    defaultValues: mathProblem ?? {
      title: "",
      status: "draft",
      content: "",
    },
  });

  const onSubmit = async (data: CreateMathProblemSchemaType) => {
    const response = mathProblem
      ? await updateMathProblem(mathProblem.id, data)
      : await createMathProblem(data);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    form.reset();
    onFinish?.();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              {...field}
              placeholder="Title goes here..."
              className={errorBorder(fieldState.error)}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="status"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              {...field}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mathProblemStatuses.map((status) => (
                  <SelectItem value={status} key={status}>
                    {getMathProblemStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Content</FieldLabel>
            <MarkdownEditor
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="w-full"
        disabled={form.formState.isSubmitting || !form.formState.isDirty}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          {mathProblem ? "Save Changes" : "Create Problem"}
        </LoadingSwap>
      </Button>
    </form>
  );
};
