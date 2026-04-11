"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "katex/dist/katex.min.css";

import dynamic from "next/dynamic";
import katex from "katex";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { MDEditorProps } from "@uiw/react-md-editor";
import {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { useTheme } from "next-themes";
import {
  codeEdit,
  codeLive,
  codePreview,
  fullscreen,
} from "@uiw/react-md-editor/commands";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "../ui/skeleton";
import { katexMacros, rehypeKatexOptions } from "./katex-config";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const getMarkdownCode = (children: unknown): string => {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(getMarkdownCode).join("");
  }

  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    typeof children.props === "object" &&
    children.props !== null &&
    "children" in children.props
  ) {
    return getMarkdownCode(children.props.children);
  }

  return "";
};

const unorderedListPattern = /^(\s*)([-*])\s+(.*)$/;
const orderedListPattern = /^(\s*)(\d+)\.\s+(.*)$/;
type PreviewOptions = NonNullable<MDEditorProps["previewOptions"]>;
type PreviewComponents = NonNullable<PreviewOptions["components"]>;

const getContinuedListLine = (line: string) => {
  const unorderedMatch = line.match(unorderedListPattern);

  if (unorderedMatch) {
    const [, indent, bullet, content] = unorderedMatch;

    if (content.trim().length === 0) {
      return { nextLine: "", removeCurrentMarker: true };
    }

    return { nextLine: `\n${indent}${bullet} `, removeCurrentMarker: false };
  }

  const orderedMatch = line.match(orderedListPattern);

  if (orderedMatch) {
    const [, indent, rawNumber, content] = orderedMatch;

    if (content.trim().length === 0) {
      return { nextLine: "", removeCurrentMarker: true };
    }

    return {
      nextLine: `\n${indent}${Number(rawNumber) + 1}. `,
      removeCurrentMarker: false,
    };
  }

  return null;
};

export const MarkdownEditor = ({
  value,
  onChange,
  height,
}: {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}) => {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    setIsPending(false);
  }, []);

  const handleListEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    const target = event.currentTarget;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const nextLineBreak = value.indexOf("\n", selectionStart);
    const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
    const currentLine = value.slice(lineStart, lineEnd);
    const continuation = getContinuedListLine(currentLine);

    if (!continuation) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation?.();

    if (continuation.removeCurrentMarker) {
      const nextValue = `${value.slice(0, lineStart)}${value.slice(lineEnd)}`;

      onChange(nextValue);

      requestAnimationFrame(() => {
        target.setSelectionRange(lineStart, lineStart);
      });

      return;
    }

    const nextValue = `${value.slice(
      0,
      selectionStart,
    )}${continuation.nextLine}${value.slice(selectionEnd)}`;

    onChange(nextValue);

    requestAnimationFrame(() => {
      const nextCaretPosition = selectionStart + continuation.nextLine.length;
      target.setSelectionRange(nextCaretPosition, nextCaretPosition);
    });
  };

  const previewOptions = useMemo(
    () =>
      ({
        className:
          "prose prose-slate max-w-none px-5 py-4 dark:prose-invert prose-headings:tracking-tight prose-pre:overflow-x-auto prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6 prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:text-muted-foreground [&_.contains-task-list]:list-none [&_.contains-task-list]:pl-0 [&_.task-list-item]:list-none [&_.task-list-item]:pl-0",
        remarkPlugins: [remarkMath],
        rehypePlugins: [[rehypeKatex, rehypeKatexOptions]],
        components: {
          ul: (({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
            <ul
              {...props}
              className="my-4 pl-6"
              style={{ listStyleType: "disc", listStylePosition: "outside" }}
            >
              {children}
            </ul>
          )) as PreviewComponents["ul"],
          ol: (({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
            <ol
              {...props}
              className="my-4 pl-6"
              style={{ listStyleType: "decimal", listStylePosition: "outside" }}
            >
              {children}
            </ol>
          )) as PreviewComponents["ol"],
          li: (({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
            <li {...props} className="my-1">
              {children}
            </li>
          )) as PreviewComponents["li"],
          code: (({
            children,
            className,
            ...props
          }: ComponentPropsWithoutRef<"code">) => {
            const code = getMarkdownCode(children).replace(/\n$/, "");

            if (
              typeof className === "string" &&
              className.toLowerCase().includes("language-katex")
            ) {
              const html = katex.renderToString(code, {
                displayMode: true,
                macros: katexMacros,
                throwOnError: false,
              });

              return (
                <code
                  {...props}
                  className="block overflow-x-auto bg-transparent px-0 text-[1.05rem]"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }

            return (
              <code {...props} className={className}>
                {children}
              </code>
            );
          }) as PreviewComponents["code"],
        },
      }) as PreviewOptions,
    [],
  );

  if (isPending) {
    return (
      <Skeleton
        aria-hidden="true"
        className="rounded-xl border border-input shadow-xs"
        style={{ height: isMobile ? 392 : 552 }}
      />
    );
  }

  return (
    <div
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
      className="rounded-xl border border-input bg-background shadow-xs"
    >
      <div className="wmde-markdown-var" />
      <div className="p-4">
        <MDEditor
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          preview={isMobile ? "edit" : "live"}
          visibleDragbar={false}
          minHeight={height ?? (isMobile ? 360 : 520)}
          height={height ?? (isMobile ? 360 : 520)}
          textareaProps={{
            placeholder: "Use fenced ```katex blocks or $$...$$ for equations.",
            onKeyDownCapture: handleListEnter,
          }}
          previewOptions={previewOptions}
          extraCommands={[codeEdit, codeLive, codePreview, fullscreen]}
          className="overflow-hidden rounded-md border-0! shadow-none!"
        />
      </div>
    </div>
  );
};
