import ModelSelector from "@/components/SelectModel";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ModelSelector />
    </div>
  );
}
