import { useState, useEffect, useCallback } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setDb(await initDB());
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
      if (!db) return [];

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
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
    },
    [db],
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
    isLoading,
    error,
    addModelTest,
    getModelTests,
    clearAllModelTests,
  };
};
