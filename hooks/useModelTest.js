import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { getOllamaClient } from "@/lib/ollamaClient";
import { DEFAULT_PROMPTS, EASY_PROMPTS, HARD_PROMPTS } from "@/lib/constants";
import { useHistory } from "@/hooks/useHistory";

export const useModelTest = (model) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [textStreaming, setTextStreaming] = useState("");
  const [globalAvgs, setGlobalAvgs] = useState(null);
  const abortController = useRef(new AbortController());
  const isInitialRender = useRef(true);
  const isMounted = useRef(true);
  const { addModelTest, getModelAverages } = useHistory();

  const ollama = useMemo(() => getOllamaClient(), []);

  const processStreamResponse = useCallback(
    async (response, prompt, difficulty) => {
      setTextStreaming((prev) => prev + ` ${prompt} `);
      for await (const part of response) {
        if (!isMounted.current || abortController.current.signal.aborted) break;
        setTextStreaming((prev) => prev + part.response);
        if (part.done) {
          setData((prev) => [...prev, part]);
          await addModelTest({
            modelName: model,
            results: part,
            difficulty,
            streamMode: true,
          });
        }
      }
    },
    [],
  );

  const processNonStreamResponse = useCallback(async (response, difficulty) => {
    if (isMounted.current) {
      setData((prev) => [...prev, response]);
      await addModelTest({
        modelName: model,
        results: response,
        difficulty,
        streamMode: false,
      });
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const testModel = async () => {
      const difficulty = localStorage.getItem("difficulty") || "default";
      const PROMPTS =
        {
          easy: EASY_PROMPTS,
          hard: HARD_PROMPTS,
          default: DEFAULT_PROMPTS,
        }[difficulty] || DEFAULT_PROMPTS;

      const streamMode = localStorage.getItem("stream") === "true";

      try {
        setGlobalAvgs(await getModelAverages(model));
        for (const prompt of PROMPTS) {
          if (!isMounted.current || abortController.current.signal.aborted)
            return;

          const response = await ollama.generate({
            model,
            prompt,
            ...(streamMode && { stream: true }),
            signal: abortController.current.signal,
          });

          await (streamMode
            ? processStreamResponse(response, prompt, difficulty)
            : processNonStreamResponse(response, difficulty));
        }
      } catch (err) {
        if (isMounted.current && !abortController.current.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (isMounted.current && !abortController.current.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (isInitialRender.current) {
      testModel();
      isInitialRender.current = false;
    }

    return () => {
      isMounted.current = false;
    };
  }, [model, processStreamResponse, processNonStreamResponse, ollama]);

  const abort = useCallback(() => {
    abortController.current.abort();
    abortController.current = new AbortController();
  }, []);

  const averages = useMemo(() => {
    if (!data.length)
      return {
        totalDuration: 0,
        loadDuration: 0,
        evalRate: { count: 0, duration: 0 },
        promptEvalRate: { count: 0, duration: 0 },
      };

    const sum = data.reduce(
      (acc, curr) => ({
        totalDuration: acc.totalDuration + curr.total_duration,
        loadDuration: acc.loadDuration + curr.load_duration,
        evalCount: acc.evalCount + curr.eval_count,
        evalDuration: acc.evalDuration + curr.eval_duration,
        promptEvalCount: acc.promptEvalCount + curr.prompt_eval_count,
        promptEvalDuration: acc.promptEvalDuration + curr.prompt_eval_duration,
      }),
      {
        totalDuration: 0,
        loadDuration: 0,
        evalCount: 0,
        evalDuration: 0,
        promptEvalCount: 0,
        promptEvalDuration: 0,
      },
    );

    return {
      totalDuration: sum.totalDuration / data.length,
      loadDuration: sum.loadDuration / data.length,
      evalRate: {
        count: sum.evalCount,
        duration: sum.evalDuration,
      },
      promptEvalRate: {
        count: sum.promptEvalCount,
        duration: sum.promptEvalDuration,
      },
      globalAvgs,
    };
  }, [data]);

  return { data, loading, error, averages, textStreaming, abort };
};
