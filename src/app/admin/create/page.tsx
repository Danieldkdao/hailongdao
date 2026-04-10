import { Card, CardContent } from "@/components/ui/card";
import { CreateUpdateProblemForm } from "@/features/math-problems/components/create-update-problem-form";

const CreateMathProblemPage = () => {
  return (
    <div className="w-full h-full py-10 px-6 overflow-y-auto">
      <div className="w-full mx-auto">
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Create New Problem</h1>
              <p className="text-base font-medium text-muted-foreground">
                Share a problem. Add a nice title and well-structured content.
              </p>
            </div>
            <CreateUpdateProblemForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMathProblemPage;
