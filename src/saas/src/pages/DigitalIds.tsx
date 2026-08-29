import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  IdCardIcon,
  RefreshCw,
  SearchIcon,
  UsersIcon,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import {
  DataTable,
  type Column,
} from "../components/ui/DataTable";

import { useApi } from "../contexts/ApiContext";
import { DigitalIdModal } from "../components/students/DigitalIdModal";

/* -------------------------------- */
/* Backend response types */
/* -------------------------------- */

type DigitalIdRecord = {
  id: number;
  campus_id: string;
  student_id: string;
  username: string;
  isActive: boolean;
  image_url: string | null;
  nfc_status: string | null;
  account_status: string | null;
  onBoardedWhen: string | null;
};

type DigitalIdsPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

type DigitalIdsResponse = {
  success: boolean;
  message?: string;
  data: DigitalIdRecord[];
  pagination: DigitalIdsPagination;
};

/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

const formatDate = (date: string | null) => {
  if (!date) {
    return "Never";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatStatus = (value: string | null | undefined) => {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* -------------------------------- */
/* Component */
/* -------------------------------- */

export function DigitalIds() {
  const navigate = useNavigate();
  const { api } = useApi();

  /* -------------------------------- */
  /* State */
  /* -------------------------------- */

  const [data, setData] = useState<DigitalIdRecord[]>([]);
  const [pagination, setPagination] =
    useState<DigitalIdsPagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedDigitalId, setSelectedDigitalId] =
    useState<DigitalIdRecord | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  /* -------------------------------- */
  /* Fetch digital IDs */
  /* -------------------------------- */

  const fetchDigitalIds = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api.get<DigitalIdsResponse>(
          "/admin/get/digital/ids",
          {
            params: {
              page,
              limit,
            },
          }
        );

        console.log("DIGITAL IDS ARRAY:", response.data.data);

        const payload = response.data;

        setData(payload?.data ?? []);
        setPagination(payload?.pagination ?? null);
      } catch (error) {
        console.error(
          "Failed to load digital IDs:",
          error
        );

        setData([]);
        setPagination(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api, page, limit]
  );

  /* -------------------------------- */
  /* Load whenever page changes */
  /* -------------------------------- */

  useEffect(() => {
    fetchDigitalIds();
  }, [fetchDigitalIds]);

  /* -------------------------------- */
  /* Refresh */
  /* -------------------------------- */

  const handleRefresh = () => {
    fetchDigitalIds(true);
  };

  /* -------------------------------- */
  /* Row selection */
  /* -------------------------------- */

  const handleDigitalIdClick = (
    digitalId: DigitalIdRecord
  ) => {
    setSelectedDigitalId(digitalId);
    setModalOpen(true);
  };

  /* -------------------------------- */
  /* Filtering */
  /*
   * IMPORTANT:
   * This filters the CURRENT PAGE.
   *
   * Global filtering should eventually
   * be implemented by the backend.
   */
  /* -------------------------------- */

  const filteredData = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return data.filter((digitalId) => {
      const matchesSearch =
        !normalizedSearch ||
        digitalId.student_id
          .toLowerCase()
          .includes(normalizedSearch) ||
        digitalId.username
          .toLowerCase()
          .includes(normalizedSearch) ||
        // digitalId.id
        //   .toLowerCase()
        //   .includes(normalizedSearch);
        String(digitalId.id)
          .toLowerCase()
          .includes(normalizedSearch)

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active"
          ? digitalId.isActive
          : statusFilter === "inactive"
          ? !digitalId.isActive
          : digitalId.account_status ===
            statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  /* -------------------------------- */
  /* Page numbers */
  /* -------------------------------- */

  const pageNumbers = useMemo(() => {
    if (!pagination) {
      return [];
    }

    const totalPages =
      pagination.total_pages;

    const pages: number[] = [];

    const start = Math.max(1, page - 2);

    const end = Math.min(
      totalPages,
      page + 2
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [pagination, page]);

  /* -------------------------------- */
  /* Columns */
  /* -------------------------------- */

  const columns: Column<DigitalIdRecord>[] = [
    {
      key: "student",
      header: "Student",
      render: (digitalId) => (
        <div className="flex items-center gap-3">
          {/* Temporary avatar */}
          {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {digitalId.username
              ? digitalId.username
                  .charAt(0)
                  .toUpperCase()
              : "S"}
          </div> */}
          <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary/10">
          {digitalId.image_url ? (
            <img
              src={digitalId.image_url}
              alt={digitalId.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
              {digitalId.username
                ? digitalId.username.charAt(0).toUpperCase()
                : "S"}
            </div>
          )}
        </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-ink">
              {digitalId.username || "Unknown student"}
            </p>

            <p className="truncate text-xs text-ink-muted">
              {digitalId.student_id}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "studentId",
      header: "Student ID",
      render: (digitalId) =>
        digitalId.student_id,
    },

    {
      key: "accountStatus",
      header: "Account",
      render: (digitalId) => (
        <span className="text-sm">
          {formatStatus(
            digitalId.account_status
          )}
        </span>
      ),
    },

    {
      key: "nfcStatus",
      header: "NFC",
      render: (digitalId) => (
        <span className="text-sm">
          {formatStatus(
            digitalId.nfc_status
          )}
        </span>
      ),
    },

    {
      key: "activation",
      header: "Activation",
      render: (digitalId) => (
        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
            digitalId.isActive
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600",
          ].join(" ")}
        >
          {digitalId.isActive
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },

    {
      key: "onBoardedWhen",
      header: "Onboarded",
      render: (digitalId) =>
        formatDate(
          digitalId.onBoardedWhen
        ),
    },

    {
      key: "actions",
      header: "Actions",
      align: "right",
      hideOnCard: true,
      render: (digitalId) => (
        <Button
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation();

            handleDigitalIdClick(
              digitalId
            );
          }}
        >
          View ID
        </Button>
      ),
    },
  ];

  /* -------------------------------- */
  /* Render */
  /* -------------------------------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital IDs"
        description="Issue and monitor the digital credentials assigned to your students."
      />

      <Card>
        {/* -------------------------------- */}
        {/* Toolbar */}
        {/* -------------------------------- */}

        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
          <div className="lg:max-w-xs lg:flex-1">
            <Input
              placeholder="Search by student ID or username…"
              leftIcon={
                <SearchIcon className="h-4 w-4" />
              }
              aria-label="Search digital IDs"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              disabled={
                loading &&
                data.length === 0
              }
            />
          </div>

          <Select
            aria-label="Filter digital IDs"
            className="lg:w-52"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            disabled={data.length === 0}
          >
            <option value="">
              All statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

            {Array.from(
              new Set(
                data
                  .map(
                    (item) =>
                      item.account_status
                  )
                  .filter(Boolean)
              )
            ).map((status) => (
              <option
                key={status}
                value={status as string}
              >
                Account:{" "}
                {formatStatus(
                  status as string
                )}
              </option>
            ))}
          </Select>

          <Button
            variant="secondary"
            leftIcon={
              <RefreshCw
                className={[
                  "h-4 w-4",
                  refreshing
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />
            }
            onClick={handleRefresh}
            disabled={
              loading || refreshing
            }
            className="lg:ml-auto"
          >
            Refresh
          </Button>
        </div>

        {/* -------------------------------- */}
        {/* Table */}
        {/* -------------------------------- */}

        <DataTable
          columns={columns}
          data={filteredData}
          loading={loading}
          rowKey={(digitalId) =>
            digitalId.id
          }
          cardTitle={(digitalId) =>
            digitalId.username ||
            digitalId.student_id
          }
          onRowClick={
            handleDigitalIdClick
          }
          empty={
            <EmptyState
              icon={
                <IdCardIcon className="h-6 w-6" />
              }
              title={
                search || statusFilter
                  ? "No matching digital IDs"
                  : "No digital IDs issued"
              }
              description={
                search || statusFilter
                  ? "Try adjusting your search or filter."
                  : "Digital identities are created from your student records. Add students first, then issue credentials to activate campus access."
              }
              primaryAction={
                !search &&
                !statusFilter ? (
                  <Button
                    leftIcon={
                      <UsersIcon className="h-4 w-4" />
                    }
                    onClick={() =>
                      navigate(
                        "/students"
                      )
                    }
                  >
                    Go to students
                  </Button>
                ) : undefined
              }
            />
          }
        />

        {/* -------------------------------- */}
        {/* Pagination */}
        {/* -------------------------------- */}

        {pagination &&
          pagination.total_pages > 0 && (
            <div className="flex flex-col gap-4 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredData.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {pagination.total}
                </span>{" "}
                digital IDs
              </p>

              <div className="flex items-center gap-1">
                {/* Previous */}

                <Button
                  variant="secondary"
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                  disabled={
                    !pagination.has_previous ||
                    loading
                  }
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}

                {pageNumbers.map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={
                        pageNumber === page
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() =>
                        setPage(
                          pageNumber
                        )
                      }
                      disabled={loading}
                      className="min-w-9"
                    >
                      {pageNumber}
                    </Button>
                  )
                )}

                {/* Next */}

                <Button
                  variant="secondary"
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                  disabled={
                    !pagination.has_next ||
                    loading
                  }
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
      </Card>

      {/* -------------------------------- */}
      {/* Digital ID Modal */}
      {/* -------------------------------- */}

      <DigitalIdModal
        open={modalOpen}
        digitalId={selectedDigitalId}
        onClose={() => {
          setModalOpen(false);
          setSelectedDigitalId(null);
        }}
      />
    </div>
  );
}