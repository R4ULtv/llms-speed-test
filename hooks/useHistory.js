import { openDB } from "idb";
import { useState, useCallback } from "react";

const DB_NAME = "HistoryDB";
const DB_VERSION = 1;
const STORE_NAME = "tests";

export const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("modelName", "modelName", { unique: false });
        store.createIndex("difficulty", "difficulty", { unique: false });
      }
    },
  });
};

export const useHistory = () => {
  const [db, setDb] = useState(null);

  const addModelTest = useCallback(
    async ({ modelName, difficulty, streamMode, results }) => {
      try {
        const database = db || (await initDB());
        if (!db) setDb(database);

        const testData = {
          modelName,
          difficulty,
          streamMode,
          results,
          timestamp: new Date().toISOString(),
        };

        const result = await database.add(STORE_NAME, testData);
        window.dispatchEvent(new CustomEvent("testAdded"));
        return result;
      } catch (err) {
        console.error("Error adding model test:", err);
        return null;
      }
    },
    [db],
  );

  const getModelTests = useCallback(
    async (modelName = null) => {
      try {
        const database = db || (await initDB());
        if (!db) setDb(database);

        const tx = database.transaction(STORE_NAME, "readonly");
        const index = modelName
          ? tx.store.index("modelName")
          : tx.store.index("timestamp");

        const tests = [];
        let cursor = await (modelName
          ? index.openCursor(modelName, "prev")
          : index.openCursor(null, "prev"));

        while (cursor) {
          tests.push(cursor.value);
          cursor = await cursor.continue();
        }

        return tests;
      } catch (err) {
        console.error("Error getting model tests:", err);
        return [];
      }
    },
    [db],
  );

  const getModelAverages = useCallback(
    async (modelName) => {
      const database = db || (await initDB());
      if (!db) setDb(database);

      try {
        const tests = await getModelTests(modelName);
        if (!tests.length) return null;

        const validTests = tests.filter((test) => test.results);
        if (!validTests.length) return null;

        const sums = validTests.reduce(
          (acc, test) => ({
            totalDuration: acc.totalDuration + test.results.total_duration,
            loadDuration: acc.loadDuration + test.results.load_duration,
            evalRate: {
              count: acc.evalRate.count + test.results.eval_count,
              duration: acc.evalRate.duration + test.results.eval_duration,
            },
          }),
          {
            totalDuration: 0,
            loadDuration: 0,
            evalRate: {
              count: 0,
              duration: 0,
            },
          },
        );

        const count = validTests.length;
        return {
          totalDuration: Math.round(sums.totalDuration / count),
          loadDuration: Math.round(sums.loadDuration / count),
          evalRate: sums.evalRate,
        };
      } catch (err) {
        console.error("Error getting model averages:", err);
        return null;
      }
    },
    [db, getModelTests],
  );

  const clearAllModelTests = useCallback(async () => {
    const database = db || (await initDB());
    if (!db) setDb(database);

    try {
      await database.clear(STORE_NAME);
      return true;
    } catch (err) {
      console.error("Error clearing tests:", err);
      return false;
    }
  }, [db]);

  return {
    addModelTest,
    getModelTests,
    getModelAverages,
    clearAllModelTests,
  };
};
