import { MathProblemStatus, MathProblemProblemStatus } from "@/db/schema";
import {
  FileEditIcon,
  GlobeIcon,
  ArchiveIcon,
  CircleDotIcon,
  CircleCheckBigIcon,
} from "lucide-react";

export const getMathProblemStatus = (status: MathProblemStatus) => {
  switch (status) {
    case "draft":
      return (
        <>
          <FileEditIcon className="size-4" />
          Draft
        </>
      );
    case "published":
      return (
        <>
          <GlobeIcon className="size-4" />
          Published
        </>
      );
    case "archived":
      return (
        <>
          <ArchiveIcon className="size-4" />
          Archived
        </>
      );
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
};

export const getMathProblemProblemStatus = (
  status: MathProblemProblemStatus,
) => {
  switch (status) {
    case "open":
      return (
        <div className="flex items-center gap-2">
          <CircleDotIcon className="size-4" />
          Open
        </div>
      );
    case "solved":
      return (
        <div className="flex items-center gap-2">
          <CircleCheckBigIcon className="size-4" />
          Solved
        </div>
      );
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
};
