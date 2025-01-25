import { useState, useEffect, useMemo, useRef } from "react";
import ollama from "ollama/browser";
import { TEST_PROMPTS } from "@/lib/constants";

export const useModelTest = (model) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    const testModel = async () => {
      try {
        for (const prompt of TEST_PROMPTS) {
          const response = await ollama.generate({
            model,
            prompt,
          });
          setData((prev) => [...prev, response]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isInitialRender.current) {
      testModel();
      isInitialRender.current = false;
    }
  }, [model]);

  const averages = useMemo(
    () => ({
      totalDuration:
        data.reduce((acc, curr) => acc + curr.total_duration, 0) / data.length,
      loadDuration:
        data.reduce((acc, curr) => acc + curr.load_duration, 0) / data.length,
      evalRate: {
        count: data.reduce((acc, curr) => acc + curr.eval_count, 0),
        duration: data.reduce((acc, curr) => acc + curr.eval_duration, 0),
      },
      promptEvalRate: {
        count: data.reduce((acc, curr) => acc + curr.prompt_eval_count, 0),
        duration: data.reduce(
          (acc, curr) => acc + curr.prompt_eval_duration,
          0,
        ),
      },
    }),
    [data],
  );

  return { data, loading, error, averages };
};
