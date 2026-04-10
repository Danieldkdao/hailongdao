import { Dispatch, SetStateAction } from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;
export type ActionOutput<T extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<T>
>;
