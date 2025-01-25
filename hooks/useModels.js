import { useState, useEffect } from "react";
import ollama from "ollama/browser";

export const useModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchModels = async () => {
      try {
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
