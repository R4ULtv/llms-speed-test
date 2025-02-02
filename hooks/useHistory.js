import { useState, useCallback } from "react";

const DB_NAME = "HistoryDB";
const DB_VERSION = 1;
const STORE_NAME = "tests";

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("modelName", "modelName", { unique: false });
        store.createIndex("difficulty", "difficulty", { unique: false });
      }
    };
  });
};

export const useHistory = () => {
  const [db, setDb] = useState(null);

  const addModelTest = useCallback(
    async ({ modelName, difficulty, streamMode, results }) => {
      try {
        const database = db || (await initDB());
        if (!db) setDb(database);

        const transaction = database.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const testData = {
          modelName,
          difficulty,
          streamMode,
          results,
          timestamp: new Date().toISOString(),
        };

        return new Promise((resolve, reject) => {
          const request = store.add(testData);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } catch (err) {
        console.error("Error adding model test:", err);
        return null;
      }
    },
    [db],
  );

  const getModelTests = useCallback(
    async (modelName = null, limit = 50, offset = 0) => {
      try {
        const database = db || (await initDB());
        if (!db) setDb(database);

        return new Promise((resolve, reject) => {
          const transaction = database.transaction([STORE_NAME], "readonly");
          const store = transaction.objectStore(STORE_NAME);
          const index = modelName
            ? store.index("modelName")
            : store.index("timestamp");
          const tests = [];
          let advanced = false;

          const request = modelName
            ? index.openCursor(IDBKeyRange.only(modelName), "prev")
            : index.openCursor(null, "prev");

          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!advanced && offset > 0) {
              advanced = true;
              cursor.advance(offset);
              return;
            }

            if (cursor && tests.length < limit) {
              tests.push(cursor.value);
              cursor.continue();
            } else {
              resolve(tests);
            }
          };

          request.onerror = () => reject(request.error);
        });
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
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  return {
    addModelTest,
    getModelTests,
    getModelAverages,
    clearAllModelTests,
  };
};
