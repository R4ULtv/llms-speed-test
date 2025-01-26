import { useState, useEffect } from "react";
import { getOllamaClient } from "@/lib/ollamaClient";

export const useModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchModels = async () => {
      try {
        const ollama = getOllamaClient();
        const data = await ollama.list();
        if (mounted) setModels(data.models);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchModels();
    return () => (mounted = false);
  }, []);

  return { models, loading, error };
};
