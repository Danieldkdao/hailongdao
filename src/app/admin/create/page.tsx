import { CreateProblemForm } from "@/features/math-problems/components/create-problem-form";

const CreateMathProblemPage = () => {
  return (
    <div className="w-full h-full py-10 px-6 overflow-y-auto">
      <div className="w-full mx-auto">
        <CreateProblemForm />
      </div>
    </div>
  );
};

export default CreateMathProblemPage;
