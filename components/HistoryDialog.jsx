"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HistoryIcon } from "@/lib/icons";
import { useHistory } from "@/hooks/useHistory";
import { formatRate } from "@/lib/formatting";

export default function HistoryDialog() {
  const { getModelTests, clearAllModelTests } = useHistory();
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setData(await getModelTests());
  }, [getModelTests]);

  useEffect(() => {
    fetchData();

    const handleTestAdded = fetchData;

    window.addEventListener("testAdded", handleTestAdded);
    return () => {
      window.removeEventListener("testAdded", handleTestAdded);
    };
  }, [fetchData]);

  return (
    <Dialog>
      <DialogTrigger
        aria-label="History"
        className="border border-zinc-200 p-2.5 rounded-lg fixed bottom-5 right-5"
      >
        <HistoryIcon className="size-4 text-zinc-800" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-3">
          <DialogHeader>
            <DialogTitle className="sm:text-center">History</DialogTitle>
            <DialogDescription className="sm:text-center">
              Previous test results are shown here. Tests are stored locally on
              your device to ensure both fast access and data privacy.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="max-h-[440px] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {data.length > 0 ? (
              data.map((item) => (
                <div key={item.id} className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.modelName}</span>
                    <span className="text-zinc-500 text-xs">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-zinc-700">
                      Difficulty:{" "}
                      <span className="font-medium">{item.difficulty}</span>
                    </p>
                    <span className="text-zinc-700">
                      Stream Mode:{" "}
                      <span className="font-medium">
                        {item.streamMode ? "Yes" : "No"}
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-zinc-700">
                      Total Duration:{" "}
                      <span className="font-medium">
                        {(item.results.total_duration / 1000000).toFixed(2)}ms
                      </span>
                    </p>
                    <p className="text-zinc-700">
                      Load Duration:{" "}
                      <span className="font-medium">
                        {(item.results.load_duration / 1000000).toFixed(2)}ms
                      </span>
                    </p>
                  </div>
                  <p className="text-zinc-700">
                    Speed:{" "}
                    <span className="font-medium">
                      {formatRate(
                        item.results.eval_count,
                        item.results.eval_duration,
                      )}{" "}
                      token/s
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <span className="text-zinc-700 text-center block">
                No test history available. Run a test to get started.
              </span>
            )}
          </div>
        </div>
        <DialogClose asChild>
          <button
            onClick={async () => {
              await clearAllModelTests();
              fetchData();
            }}
            type="button"
            className="flex-1 p-2 sm:p-1.5 bg-zinc-900 text-zinc-100 rounded-lg"
          >
            Delete History
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
