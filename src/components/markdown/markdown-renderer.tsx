import MDEditor from "@uiw/react-md-editor";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export const MarkdownRenderer = ({ children }: { children: string }) => {
  return (
    <MDEditor.Markdown
      source={children}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    />
  );
};
