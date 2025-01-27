"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getOllamaClient } from "@/lib/ollamaClient";

const POLLING_INTERVAL = 5000;
const ANIMATION_PROPS = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function RunningModels() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchModels = async () => {
      try {
        const ollama = getOllamaClient();
        const response = await ollama.ps();
        if (response && isSubscribed) {
          setData(response.models);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };

    fetchModels();
    const interval = setInterval(fetchModels, POLLING_INTERVAL);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  const getGPURatio = useMemo(
    () => (size, vram_size) => {
      if (vram_size < size) {
        return Math.floor((vram_size / size) * 100);
      }
      return 100;
    },
    [],
  );

  return (
    <AnimatePresence>
      {data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-5 border border-zinc-200 shadow px-3 py-1.5 rounded-full"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex size-2">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500" />
              <span className="relative inline-flex rounded-full size-2 opacity-90 bg-green-500" />
            </div>
            <span className="text-xs text-zinc-900 font-semibold">
              {data[0].name} - GPU{" "}
              {getGPURatio(data[0].size, data[0].size_vram)}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
