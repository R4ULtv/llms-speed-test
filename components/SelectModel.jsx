"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelListItem } from "@/components/ModelListItem";
import { TestModel } from "@/components/TestModel";
import { useModels } from "@/hooks/useModels";

export default function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(null);
  const { models, loading, error } = useModels();

  if (error)
    return <div className="text-red-500">Error loading models: {error}</div>;
  if (selectedModel) return <TestModel model={selectedModel} />;

  return (
    <>
      <h1 className="text-4xl font-bold text-zinc-900">LLMs Speed Test</h1>
      <p className="mt-2 mb-4 text-zinc-700">
        Test every installed model and compare their completion speed.
      </p>
      <Select onValueChange={setSelectedModel}>
        <SelectTrigger className="h-auto w-fit mx-auto ps-3 border border-zinc-200 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
          <SelectValue placeholder="Select a model from ollama" />
        </SelectTrigger>
        <SelectContent
          align="center"
          className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-12 [&_*[role=option]]:ps-2"
        >
          {models.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              <ModelListItem item={item} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1.5 mt-3">
        {models.length > 0 &&
          models.slice(0, 3).map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedModel(item.name)}
              className="text-xs px-2.5 py-1.5 font-semibold text-zinc-700 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors ease-out"
            >
              {item.name}
            </button>
          ))}
      </div>
    </>
  );
}
