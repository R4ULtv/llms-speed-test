"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUturnLeftIcon, Cog6ToothIcon } from "@heroicons/react/16/solid";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULT_HOST = "http://127.0.0.1:11434";
const DEFAULT_DIFFICULTY = "default";
const DEFAULT_STREAM_MODE = false;

export default function Settings() {
  const [host, setHost] = useState(DEFAULT_HOST);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [streamMode, setStreamMode] = useState(DEFAULT_STREAM_MODE);

  useEffect(() => {
    const savedHost = localStorage.getItem("host");
    const savedDifficulty = localStorage.getItem("difficulty");
    const savedStreamMode = localStorage.getItem("stream");
    if (savedHost) setHost(savedHost);
    if (savedDifficulty) setDifficulty(savedDifficulty);
    if (savedStreamMode !== null) setStreamMode(savedStreamMode === "true");
  }, [open]);

  const handleSave = useCallback(() => {
    localStorage.setItem("host", host);
    localStorage.setItem("difficulty", difficulty);
    localStorage.setItem("stream", streamMode);
  }, [host, difficulty, streamMode]);

  return (
    <Dialog>
      <DialogTrigger
        aria-label="Settings"
        className="border border-zinc-200 p-2.5 rounded-lg"
      >
        <Cog6ToothIcon className="size-4 text-zinc-800" />
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Settings</DialogTitle>
            <DialogDescription className="sm:text-center">
              Configure your Ollama host and test difficulty settings.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="host" className="text-sm font-medium text-zinc-700">
              Ollama Host
            </label>
            <div className="relative">
              <Input
                id="host"
                type="url"
                placeholder={DEFAULT_HOST}
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="mt-1 rounded-lg"
              />
              {host !== DEFAULT_HOST && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={() => setHost(DEFAULT_HOST)}
                    className="text-xs text-zinc-700 hover:underline"
                  >
                    <ArrowUturnLeftIcon className="size-3" />
                  </button>
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-700">
              Remember to set{" "}
              <span className="font-mono text-zinc-900 bg-zinc-200 px-1 py-0.5 rounded-xs">
                OLLAMA_ORIGINS = *
              </span>
              . Follow the instructions{" "}
              <a
                href="https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server"
                target="_blank"
                className="text-zinc-900 hover:underline underline-offset-2"
              >
                here
              </a>
              .
            </p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="stream"
              className="text-sm font-medium text-zinc-700"
            >
              Stream Mode
            </label>
            <div className="flex items-center gap-1.5 mt-1">
              <Checkbox
                id="stream"
                checked={streamMode}
                onCheckedChange={(e) => setStreamMode(e)}
                className="rounded border-zinc-300"
              />
              <label htmlFor="stream" className="text-sm text-zinc-700">
                Enable streaming responses. This can decrease the{" "}
                <span className="font-mono text-xs text-zinc-900 bg-zinc-200 px-1 py-0.5 rounded-xs">
                  token/s
                </span>
                .
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Test Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="mt-1 h-10 rounded-lg">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                <SelectItem value="easy">Easy (Fast)</SelectItem>
                <SelectItem value="default">Default (Normal)</SelectItem>
                <SelectItem value="hard">Hard (Slow)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose
              type="button"
              className="flex-1 border border-zinc-300 p-2 sm:p-1.5 rounded-lg"
            >
              Cancel
            </DialogClose>
            <DialogClose
              type="button"
              onClick={handleSave}
              className="flex-1 p-2 sm:p-1.5 bg-zinc-900 text-zinc-100 rounded-lg"
            >
              Save
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
