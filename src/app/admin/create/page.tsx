import { CreateProblemForm } from "@/features/math-problems/components/create-problem-form";

const CreateMathProblemPage = () => {
  return (
    <div className="w-full h-full py-10 px-6 flex items-center justify-center overflow-auto">
      <div className="w-full max-w-150">
        <CreateProblemForm />
      </div>
    </div>
  );
};

export default CreateMathProblemPage;
