"use client";

import { DifficultyStars } from "@/components/difficulty-stars";
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
import {
  MathProblemDifficultyLevel,
  mathProblemDifficultyLevels,
  MathProblemStatus,
  mathProblemStatuses,
} from "@/db/schema";
import { KeywordInputSelect } from "@/features/keywords/components/keyword-input-select";
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
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

export const CreateUpdateProblemForm = ({
  mathProblem,
  keywords,
  onFinish,
}: {
  mathProblem?: {
    id: string;
    title: string;
    status: MathProblemStatus;
    difficultyLevel: MathProblemDifficultyLevel;
    content: string;
  };
  keywords: { id: string; keyword: string }[];
  onFinish?: () => void;
}) => {
  const form = useForm<CreateMathProblemSchemaType>({
    resolver: zodResolver(createMathProblemSchema),
    defaultValues: mathProblem
      ? {
          ...mathProblem,
          keywords: keywords.map((k) => k.keyword),
        }
      : {
          title: "",
          status: "draft",
          content: "",
          difficultyLevel: 3,
          keywords: [],
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

  const selectedKeywords = form.watch("keywords");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
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
        name="difficultyLevel"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Difficulty Level</FieldLabel>
            <Select
              {...field}
              value={field.value.toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className={errorBorder(fieldState.error)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mathProblemDifficultyLevels.map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    <DifficultyStars
                      difficultyLevel={
                        Number(level) as MathProblemDifficultyLevel
                      }
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="keywords"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Keywords</FieldLabel>
            <KeywordInputSelect
              keywords={keywords.map((k) => ({ id: k.id, keyword: k.keyword }))}
              values={field.value}
              onChange={field.onChange}
            />
            <div className="flex items-center gap-2 flex-wrap">
              {selectedKeywords.map((keyword) => (
                <Badge key={keyword}>
                  {keyword}
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() =>
                      field.onChange(field.value.filter((k) => k !== keyword))
                    }
                  >
                    <XIcon className="size-4" />
                  </button>
                </Badge>
              ))}
            </div>
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
