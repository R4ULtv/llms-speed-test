import { toBlob, toPng } from "html-to-image";
import { formatRate } from "@/lib/formatting";

const createGhostContainer = (clone) => {
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
  });
  container.appendChild(clone);
  return container;
};

const prepareClone = (element) => {
  const clone = element.cloneNode(true);
  clone.style.width = "384px";
  const actionsDiv = clone.querySelector("#actions");
  actionsDiv?.remove();
  return clone;
};

const imageConfig = {
  quality: 1,
  pixelRatio: 2,
  style: {
    backgroundColor: "#f4f4f5",
    overflow: "visible",
    transform: "none",
    boxShadow: "none",
  },
};

export const handleShare = async (element, modelName) => {
  if (!element || !modelName) return;

  try {
    const clone = prepareClone(element);
    const ghostContainer = createGhostContainer(clone);
    document.body.appendChild(ghostContainer);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const blob = await toBlob(clone, imageConfig);
    if (!blob) throw new Error("Failed to capture component image");

    const file = new File([blob], `${modelName}-results.png`, {
      type: "image/png",
    });
    const shareData = {
      title: `Model Test Results - ${modelName}`,
      text: `Check out these test results for ${modelName}!\n\nGenerated on ${new Date().toLocaleDateString()}.`,
      files: [file],
    };

    if (navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      alert("Web Share API not supported in this browser");
    }
  } catch (error) {
    console.error("Sharing failed:", error);
  }
};

export const exportToPNG = async (element, modelName) => {
  if (!element || !modelName) return;

  try {
    const clone = prepareClone(element);
    const ghostContainer = createGhostContainer(clone);
    document.body.appendChild(ghostContainer);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const dataUrl = await toPng(clone, imageConfig);
    document.body.removeChild(ghostContainer);

    const link = document.createElement("a");
    link.download = `${modelName}-results-${new Date().toISOString().split("T")[0]}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error generating PNG:", error);
  }
};

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

  const formatDuration = (dur) => dur / 1e6;

  const dataRows = data.map((response, index) => [
    index + 1,
    formatDuration(response.total_duration),
    formatDuration(response.load_duration),
    response.eval_count,
    formatDuration(response.eval_duration),
    formatRate(response.eval_count, response.eval_duration),
    response.prompt_eval_count,
    formatDuration(response.prompt_eval_duration),
    formatRate(response.prompt_eval_count, response.prompt_eval_duration),
  ]);

  const averagesRow = [
    "Averages",
    formatDuration(averages.totalDuration),
    formatDuration(averages.loadDuration),
    averages.evalRate.count,
    formatDuration(averages.evalRate.duration),
    formatRate(averages.evalRate.count, averages.evalRate.duration),
    averages.promptEvalRate.count,
    formatDuration(averages.promptEvalRate.duration),
    formatRate(averages.promptEvalRate.count, averages.promptEvalRate.duration),
  ];

  const csvContent = [headers, ...dataRows, [], averagesRow]
    .map((row) => row.join(","))
    .join("\n");

  const link = document.createElement("a");
  const url = URL.createObjectURL(
    new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
  );
  Object.assign(link, {
    href: url,
    download: `${data[0].model}-results-${new Date().toISOString().split("T")[0]}.csv`,
    style: { visibility: "hidden" },
  });

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
