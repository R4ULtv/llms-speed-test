import { memo } from "react";
import { motion } from "motion/react";

import {
  ArrowDownTrayIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ShareIcon,
} from "@heroicons/react/16/solid";
import { TextShimmer } from "@/components/animation/text-shimmer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const AveragesSection = ({ averages }) => {
  const getMetricTrend = (current, global, isEvalRate = false) => {
    if (!averages.globalAvgs) return null;

    const comparison = isEvalRate
      ? current.count / current.duration < global.count / global.duration
      : current < global;

    return comparison
      ? `down${isEvalRate ? "+inverted" : ""}`
      : `up${isEvalRate ? "+inverted" : ""}`;
  };

  return (
    <div className="space-y-1 border-t border-dashed border-zinc-300 pt-4">
      <TooltipProvider>
        <MetricRow
          label="avg total duration"
          value={formatTime(averages.totalDuration)}
          trend={getMetricTrend(
            averages.totalDuration,
            averages.globalAvgs?.totalDuration,
          )}
          tooltipContent={
            averages.globalAvgs &&
            formatTime(averages.globalAvgs?.totalDuration)
          }
        />
        <MetricRow
          label="avg load duration"
          value={formatTime(averages.loadDuration)}
          trend={getMetricTrend(
            averages.loadDuration,
            averages.globalAvgs?.loadDuration,
          )}
          tooltipContent={
            averages.globalAvgs && formatTime(averages.globalAvgs?.loadDuration)
          }
        />
        <MetricRow
          label="avg eval rate"
          value={`${formatRate(averages.evalRate.count, averages.evalRate.duration)} token/s`}
          trend={getMetricTrend(
            averages.evalRate,
            averages.globalAvgs?.evalRate,
            true,
          )}
          tooltipContent={
            averages.globalAvgs &&
            `${formatRate(averages.globalAvgs.evalRate.count, averages.globalAvgs.evalRate.duration)} token/s`
          }
        />
      </TooltipProvider>
    </div>
  );
};

const MetricRow = ({ label, value, trend, tooltipContent }) => {
  const getTrendIcon = () => {
    if (!trend) return null;

    const isDown = trend.startsWith("down");
    const Icon = isDown ? ArrowTrendingDownIcon : ArrowTrendingUpIcon;
    const colorClass =
      trend === "down" || trend === "up+inverted"
        ? "text-green-500"
        : "text-red-500";

    return <Icon className={`size-4 ${colorClass}`} />;
  };

  return (
    <div className="flex items-center justify-between">
      {label}
      {tooltipContent ? (
        <Tooltip>
          <TooltipTrigger>
            <span className="flex items-center gap-1">
              {getTrendIcon()}
              {value}
            </span>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      ) : (
        <span className="flex items-center gap-1">
          {getTrendIcon()}
          {value}
        </span>
      )}
    </div>
  );
};

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
