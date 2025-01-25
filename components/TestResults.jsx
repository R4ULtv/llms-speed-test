import { memo } from "react";
import { ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/16/solid";
import { formatTime, formatRate } from "@/lib/formatting";
import { exportToCSV } from "@/lib/exportUtils";

export const TestResults = memo(({ data, loading, averages }) => {
  return (
    <div className="space-y-4">
      {data.map((response, index) => (
        <ResultItem key={index} response={response} />
      ))}
      {loading && <div className="text-zinc-700">Loading more Results...</div>}
      {!loading && data.length > 0 && (
        <>
          <AveragesSection averages={averages} />
          <ActionButtons data={data} averages={averages} />
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

const ActionButtons = ({ data, averages }) => (
  <div className="flex items-center justify-center gap-2 mt-4 text-zinc-800">
    <button className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-transparent hover:border-zinc-300 transition-colors">
      <ArrowDownTrayIcon className="size-4" /> PNG
    </button>
    <button
      onClick={() => exportToCSV(data, averages)}
      className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-transparent hover:border-zinc-300 transition-colors"
    >
      <ArrowDownTrayIcon className="size-4" /> CSV
    </button>
    <button className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-transparent hover:border-zinc-300 transition-colors">
      <ShareIcon className="size-4" /> Share
    </button>
  </div>
);
