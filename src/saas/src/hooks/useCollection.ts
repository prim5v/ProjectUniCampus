import { useCallback, useEffect, useState } from "react";

interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Loads an async collection and tracks
 * loading/error/empty states.
 */
export function useCollection<T>(
  fetcher: () => Promise<T[]>
): CollectionState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      fetcher()
        .then((result) => {
          if (!active) return;

          setData(result);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Collection fetch error:", err);

          if (!active) return;

          setData([]);
          setLoading(false);
          setError("Unable to load data.");
        });
    }, 550);

    return () => {
      active = false;
      clearTimeout(timer);
    };

    // IMPORTANT:
    // fetcher intentionally excluded.
    // refreshKey controls when the collection reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}