"use client";

import { useState, useEffect, useCallback } from "react";
import { Cog6ToothIcon } from "@heroicons/react/16/solid";

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

const DEFAULT_HOST = "http://127.0.0.1:11434";
const DEFAULT_DIFFICULTY = "default";

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState(DEFAULT_HOST);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);

  useEffect(() => {
    const savedHost = localStorage.getItem("host");
    const savedDifficulty = localStorage.getItem("difficulty");
    if (savedHost) setHost(savedHost);
    if (savedDifficulty) setDifficulty(savedDifficulty);
  }, []);

  const handleSave = useCallback(() => {
    setOpen(false);
    localStorage.setItem("host", host);
    localStorage.setItem("difficulty", difficulty);
  }, [host, difficulty]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border border-zinc-200 p-2.5 rounded-lg">
        <Cog6ToothIcon className="size-4" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Settings</DialogTitle>
            <DialogDescription className="sm:text-center">
              Configure the host or other settings for the Speed Test.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="host" className="text-sm font-medium text-zinc-700">
              Ollama Host
            </label>
            <Input
              id="host"
              type="text"
              placeholder={DEFAULT_HOST}
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Test Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 border border-zinc-300 p-1 rounded-lg"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleSave}
              type="button"
              className="flex-1 p-1 bg-zinc-900 text-zinc-100 rounded-lg"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
