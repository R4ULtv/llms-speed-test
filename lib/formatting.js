export const formatTime = (time) => {
  const ms = time / 1e6;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  return `${(seconds / 60).toFixed(2)}m`;
};

export const formatRate = (count, duration) =>
  ((count / duration) * 1e9).toFixed(2);

export const formatSize = (size) => `${(size / 1024 ** 3).toFixed(2)} GB`;

export const formatModelName = (name) => {
  const [baseName, param] = name.split(":");
  return { baseName, param };
};
