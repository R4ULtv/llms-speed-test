"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelListItem } from "@/components/ModelListItem";
import { TestModel } from "@/components/TestModel";
import { useModels } from "@/hooks/useModels";
import Settings from "@/components/Settings";
import { SnappyLogo } from "@/lib/icons";

export default function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(null);
  const { models, loading, error } = useModels();

  if (error) toast.error("Error occurred connecting to Ollama");
  if (selectedModel)
    return (
      <TestModel model={selectedModel} onBack={() => setSelectedModel(null)} />
    );

  return (
    <>
      <SnappyLogo className="size-16 mb-4" />
      <h1 className="text-4xl font-bold text-zinc-900">Snappy</h1>
      <p className="mt-2 mb-6 text-zinc-700 max-w-sm mx-auto text-balance text-center">
        Benchmark your Local LLMs in Seconds!
      </p>
      <div className="flex items-center gap-2">
        <Select onValueChange={setSelectedModel}>
          <SelectTrigger
            aria-label="Select Model"
            className="h-auto w-fit mx-auto ps-3 gap-1.5 shadow-none rounded-lg border border-zinc-200 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
          >
            <SelectValue placeholder="Select a model from ollama" />
          </SelectTrigger>
          <SelectContent
            align="center"
            className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-12 [&_*[role=option]]:ps-2"
          >
            <SelectGroup>
              <SelectLabel>Ollama</SelectLabel>
              {models.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  <ModelListItem item={item} />
                </SelectItem>
              ))}
            </SelectGroup>
            {error && (
              <SelectItem value="error" disabled>
                Error loading models
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Settings />
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        {loading && (
          <>
            <div className="w-20 h-7 border border-zinc-200 animate-pulse rounded-lg" />
            <div className="w-20 h-7 border border-zinc-200 animate-pulse rounded-lg" />
            <div className="w-20 h-7 border border-zinc-200 animate-pulse rounded-lg" />
          </>
        )}
        {!loading &&
          models.length > 0 &&
          models.slice(0, 3).map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedModel(item.name)}
              className="text-xs px-2.5 py-1.5 font-semibold text-zinc-700 border border-zinc-200 rounded-lg"
            >
              {item.name}
            </button>
          ))}
      </div>
    </>
  );
}
