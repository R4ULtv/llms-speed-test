import HistoryDialog from "@/components/HistoryDialog";
import RunningModels from "@/components/RunningModels";
import ModelSelector from "@/components/SelectModel";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-svh">
      <RunningModels />
      <ModelSelector />
      <HistoryDialog />
    </div>
  );
}
