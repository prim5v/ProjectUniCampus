
import { useEffect, useState } from "react";

interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

/**
 * Loads an async collection and tracks loading/error/empty states so pages
 * can render proper loading skeletons and empty states without duplication.
 */
export function useCollection<T>(fetcher: () => Promise<T[]>): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    data: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    // Small delay mirrors a network round-trip so loading states are exercised.
    const timer = setTimeout(() => {
      fetcher().
      then((data) => {
        if (active) setState({ data, loading: false, error: null });
      }).
      catch(() => {
        if (active)
        setState({ data: [], loading: false, error: "Unable to load data." });
      });
    }, 550);

    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}