import { useRef } from "react";
import { motion } from "motion/react";
import { TestResults } from "@/components/TestResults";
import { useModelTest } from "@/hooks/useModelTest";

export const TestModel = ({ model }) => {
  const componentRef = useRef();
  const { data, loading, error, averages, textStreaming } = useModelTest(model);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex items-center gap-6 w-full justify-center">
      <motion.div
        ref={componentRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col gap-4 font-mono text-sm w-full max-w-sm border border-zinc-200 shadow-xl rounded-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition ease-out"
      >
        <ModelHeader model={model} />
        <TestResults
          data={data}
          loading={loading}
          averages={averages}
          componentRef={componentRef}
        />
      </motion.div>
      {textStreaming && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col gap-4 font-mono text-sm w-full max-w-sm max-h-[592px] border border-zinc-200 shadow-xl rounded-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition ease-out"
        >
          <div className="border-b border-dashed border-zinc-300 pb-2 text-zinc-700">
            Text Streaming
          </div>
          <div className="flex flex-col-reverse overflow-y-auto overflow-x-hidden">
            {textStreaming}
          </div>
        </motion.div>
      )}
    </div>
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
