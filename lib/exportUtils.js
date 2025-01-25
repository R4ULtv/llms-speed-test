import { formatRate } from "@/lib/formatting";

export const exportToCSV = (data, averages) => {
  const headers = [
    "Run #",
    "Total Duration (ms)",
    "Load Duration (ms)",
    "Eval Count",
    "Eval Duration (ms)",
    "Eval Rate (token/s)",
    "Prompt Eval Count",
    "Prompt Eval Duration (ms)",
    "Prompt Eval Rate (token/s)",
  ];

  const dataRows = data.map((response, index) => [
    index + 1,
    response.total_duration / 1e6,
    response.load_duration / 1e6,
    response.eval_count,
    response.eval_duration / 1e6,
    formatRate(response.eval_count, response.eval_duration),
    response.prompt_eval_count,
    response.prompt_eval_duration / 1e6,
    formatRate(response.prompt_eval_count, response.prompt_eval_duration),
  ]);

  const averagesRow = [
    "Averages",
    averages.totalDuration / 1e6,
    averages.loadDuration / 1e6,
    averages.evalRate.count,
    averages.evalRate.duration / 1e6,
    formatRate(averages.evalRate.count, averages.evalRate.duration),
    averages.promptEvalRate.count,
    averages.promptEvalRate.duration / 1e6,
    formatRate(averages.promptEvalRate.count, averages.promptEvalRate.duration),
  ];

  const csvContent = [
    headers,
    ...dataRows,
    [], // Empty row for spacing
    averagesRow,
  ]
    .map((row) => row.join(","))
    .join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${data[0].model}-results-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
