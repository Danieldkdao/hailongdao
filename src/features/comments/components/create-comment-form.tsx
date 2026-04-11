"use client";

import { Controller, useForm } from "react-hook-form";
import {
  createCommentSchema,
  CreateCommentSchemaType,
} from "../actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { Button } from "@/components/ui/button";
import { createComment } from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingSwap } from "@/components/ui/loading-swap";

export const CreateCommentForm = ({
  mathProblemId,
}: {
  mathProblemId: string;
}) => {
  const router = useRouter();
  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: CreateCommentSchemaType) => {
    const response = await createComment(mathProblemId, data);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    form.reset();
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Comment</FieldLabel>
            <MarkdownEditor {...field} height={200} />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="w-full"
        disabled={form.formState.isSubmitting || !form.formState.isDirty}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          Post Comment
        </LoadingSwap>
      </Button>
    </form>
  );
};
