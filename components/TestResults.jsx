import { memo } from "react";
import { motion } from "motion/react";

import { ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/16/solid";
import { TextShimmer } from "@/components/animation/text-shimmer";

import { formatTime, formatRate } from "@/lib/formatting";
import { exportToCSV, exportToPNG, handleShare } from "@/lib/exportUtils";

export const TestResults = memo(({ data, loading, averages, componentRef }) => {
  const loadingMessages = [
    "Initializing test...",
    "Processing results...",
    "Almost there...",
    "Loading more results...",
  ];

  return (
    <div className="space-y-4">
      {data.map((response, index) => (
        <motion.div
          key={index}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <ResultItem response={response} />
        </motion.div>
      ))}
      {loading && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TextShimmer
            duration={1.2}
            className="[--base-color:var(--color-zinc-700)] [--base-gradient-color:var(--color-zinc-200)]"
          >
            {loadingMessages[data.length % loadingMessages.length]}
          </TextShimmer>
        </motion.div>
      )}
      {!loading && data.length > 0 && (
        <>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AveragesSection averages={averages} />
          </motion.div>
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ActionButtons
              data={data}
              averages={averages}
              componentRef={componentRef}
            />
          </motion.div>
        </>
      )}
    </div>
  );
});

const ResultItem = ({ response }) => (
  <div className="space-y-1">
    <MetricRow
      label="total duration"
      value={formatTime(response.total_duration)}
    />
    <MetricRow
      label="load duration"
      value={formatTime(response.load_duration)}
    />
    <MetricRow
      label="eval rate"
      value={`${formatRate(response.eval_count, response.eval_duration)} token/s`}
    />
  </div>
);

const AveragesSection = ({ averages }) => (
  <div className="space-y-1 border-t border-dashed border-zinc-300 pt-4">
    <MetricRow
      label="avg total duration"
      value={formatTime(averages.totalDuration)}
    />
    <MetricRow
      label="avg load duration"
      value={formatTime(averages.loadDuration)}
    />
    <MetricRow
      label="avg eval rate"
      value={`${formatRate(averages.evalRate.count, averages.evalRate.duration)} token/s`}
    />
  </div>
);

const MetricRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    {label} <span>{value}</span>
  </div>
);

const ActionButtons = ({ data, averages, componentRef }) => (
  <div
    id="actions"
    className="flex items-center justify-center gap-2 mt-4 text-zinc-800"
  >
    <button
      onClick={() => exportToPNG(componentRef.current, data[0]?.model)}
      className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:scale-105 transition-transform ease-out disabled:opacity-50"
    >
      <ArrowDownTrayIcon className="size-4" /> PNG
    </button>
    <button
      onClick={() => exportToCSV(data, averages)}
      className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:scale-105 transition-transform ease-out disabled:opacity-50"
    >
      <ArrowDownTrayIcon className="size-4" /> CSV
    </button>
    <button
      onClick={() => handleShare(componentRef.current, data[0]?.model)}
      className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:scale-105 transition-transform ease-out disabled:opacity-50"
    >
      <ShareIcon className="size-4" /> Share
    </button>
  </div>
);
