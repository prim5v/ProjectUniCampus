


import React from "react";
import { cn } from "../../lib/utils";
import { TableSkeleton } from "./Skeleton";

export interface Column<T> {
  key: string;
  header: string;
  /** Render the cell. Also used as the value on mobile cards. */
  render: (row: T) => React.ReactNode;
  /** Hidden on the mobile card view (e.g. redundant/decorative). */
  hideOnCard?: boolean;
  className?: string;
  align?: "left" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  /** Title shown as the primary label on the mobile card. */
  cardTitle: (row: T) => React.ReactNode;
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  cardTitle,
  empty,
  onRowClick
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton columns={columns.length} />;
  }

  if (data.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <>
      {/* Desktop / laptop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {columns.map((col) =>
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted",
                  col.align === "right" ? "text-right" : "text-left",
                  col.className
                )}>
                
                  {col.header}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.map((row) =>
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "transition-colors",
                onRowClick && "cursor-pointer hover:bg-slate-50"
              )}>
              
                {columns.map((col) =>
              <td
                key={col.key}
                className={cn(
                  "px-5 py-4 text-ink align-middle",
                  col.align === "right" ? "text-right" : "text-left",
                  col.className
                )}>
                
                    {col.render(row)}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-line">
        {data.map((row) => {
          const cardCols = columns.filter((c) => !c.hideOnCard);
          return (
            <div
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn("p-4", onRowClick && "active:bg-slate-50")}>
              
              <div className="text-sm font-semibold text-ink">{cardTitle(row)}</div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {cardCols.map((col) =>
                <div key={col.key} className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                      {col.header}
                    </dt>
                    <dd className="mt-0.5 text-sm text-ink truncate">{col.render(row)}</dd>
                  </div>
                )}
              </dl>
            </div>);

        })}
      </div>
    </>);

}