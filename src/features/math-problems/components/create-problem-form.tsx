"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import {
  createMathProblemSchema,
  CreateMathProblemSchemaType,
} from "../actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { Input } from "@/components/ui/input";
import { errorBorder } from "@/lib/utils";
import { createMathProblem } from "../actions/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mathProblemStatuses } from "@/db/schema";
import { getMathProblemStatus } from "./math-problem-list-table";

export const CreateProblemForm = () => {
  const form = useForm<CreateMathProblemSchemaType>({
    resolver: zodResolver(createMathProblemSchema),
    defaultValues: {
      title: "",
      status: "draft",
      content: "",
    },
  });

  const onSubmit = async (data: CreateMathProblemSchemaType) => {
    const response = await createMathProblem(data);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    form.reset();
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Create New Problem</h1>
          <p className="text-base font-medium text-muted-foreground">
            Share a problem. Add a nice title and well-structured content.
          </p>
        </div>

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
              <div className="flex items-center gap-2">
                <PlusIcon />
                Create Problem
              </div>
            </LoadingSwap>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
