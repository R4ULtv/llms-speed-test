import { motion } from "motion/react";
import { TestResults } from "@/components/TestResults";
import { useModelTest } from "@/hooks/useModelTest";

export const TestModel = ({ model }) => {
  const { data, loading, error, averages } = useModelTest(model);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col gap-4 font-mono text-sm w-full max-w-sm mx-auto border border-zinc-200 shadow-xl rounded-xl p-6 hover:shadow-2xl transition-shadow ease-out"
    >
      <ModelHeader model={model} />
      <TestResults data={data} loading={loading} averages={averages} />
    </motion.div>
  );
};

const ModelHeader = ({ model }) => (
  <div className="border-b border-dashed border-zinc-300 pb-2">
    <motion.h3
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-lg font-semibold"
    >
      Model: {model}
    </motion.h3>
    <motion.p
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="text-zinc-700"
    >
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </motion.p>
  </div>
);
