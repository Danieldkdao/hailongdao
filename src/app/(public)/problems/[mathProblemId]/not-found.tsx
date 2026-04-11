import Link from "next/link";
import { ArrowLeftIcon, SearchXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MathProblemNotFoundPage = () => {
  return (
    <div className="px-6 py-10">
      <Card className="mx-auto max-w-2xl border-dashed shadow-none">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchXIcon className="size-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Problem not found</h1>
            <p className="text-muted-foreground">
              This problem may have been removed, unpublished, or the link is no
              longer valid.
            </p>
          </div>
          <Button asChild>
            <Link href="/">
              <ArrowLeftIcon />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MathProblemNotFoundPage;
