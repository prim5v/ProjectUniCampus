import { useSearchParams } from "react-router-dom";
import { DirectionA } from "./home/DirectionA";
import { DirectionB } from "./home/DirectionB";
import { DirectionC } from "./home/DirectionC";

const dirs = { a: DirectionA, b: DirectionB, c: DirectionC } as const;
type Key = keyof typeof dirs;
const labels: Record<Key, string> = { a: "A · Institutional", b: "B · Infrastructure", c: "C · Editorial" };

/** Dev-only comparison route. Registered only when import.meta.env.DEV is true. */
export function DesignPreview() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("v");
  const v: Key = raw === "b" || raw === "c" ? raw : "a";
  const Page = dirs[v];
  return (
    <>
      <Page />
      <div role="toolbar" aria-label="Design direction" className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border bg-white p-1 shadow-lg" style={{ borderColor: "#e6e8e4" }}>
        {(Object.keys(dirs) as Key[]).map((k) => (
          <button key={k} onClick={() => setParams({ v: k })} aria-pressed={v === k}
            className="rounded-full px-4 py-2 text-sm font-medium"
            style={v === k ? { background: "#14532d", color: "#fff" } : { color: "#14181a" }}>
            {labels[k]}
          </button>
        ))}
      </div>
    </>
  );
}
