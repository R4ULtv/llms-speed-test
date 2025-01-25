import { TestResults } from "@/components/TestResults";
import { useModelTest } from "@/hooks/useModelTest";

export const TestModel = ({ model }) => {
  const { data, loading, error, averages } = useModelTest(model);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 font-mono text-sm w-full max-w-sm mx-auto border border-zinc-200 shadow-xl rounded-xl p-6 hover:shadow-2xl hover:scale-[1.02] transition ease-out">
      <ModelHeader model={model} />
      <TestResults data={data} loading={loading} averages={averages} />
    </div>
  );
};

const ModelHeader = ({ model }) => (
  <div className="border-b border-dashed pb-2">
    <h3 className="text-lg font-semibold">Model: {model}</h3>
    <p className="text-zinc-700">
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </div>
);
