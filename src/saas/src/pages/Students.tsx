import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  UploadIcon,
  UsersIcon,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import { DataTable, type Column } from "../components/ui/DataTable";

import { StudentStatusBadge } from "../lib/status";
import type { Student } from "../types";

import { AddStudentModal } from "../components/students/AddStudentModal";
import { ImportStudentsModal } from "../components/students/ImportStudentsModal";
import { StudentDetailsModal } from "../components/students/StudentDetailsModal";

import { getStudents, type StudentsPagination } from "../services/data";
import { useApi } from "../contexts/ApiContext";

export function Students() {
  const { api } = useApi();

  const [data, setData] = useState<Student[]>([]);
  const [pagination, setPagination] =
    useState<StudentsPagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  /*
   * --------------------------------
   * Fetch students
   * --------------------------------
   */

  const fetchStudents = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getStudents(
          api,
          page,
          limit
        );

        setData(response.data || []);
        console.log(response.data);
        setPagination(response.pagination || null);

      } catch (error) {
        console.error(
          "Failed to load students:",
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

  /*
   * --------------------------------
   * Load whenever page changes
   * --------------------------------
   */

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /*
   * --------------------------------
   * Refresh current page
   * --------------------------------
   */

  const handleRefresh = () => {
    fetchStudents(true);
  };

  /*
   * --------------------------------
   * Row selection
   * --------------------------------
   */

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  /*
   * --------------------------------
   * Frontend filtering
   *
   * IMPORTANT:
   * This filters the CURRENT PAGE.
   *
   * Backend filtering should eventually
   * be added for proper global search.
   * --------------------------------
   */

  const filteredData = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return data.filter((student) => {
      const matchesSearch =
        !normalizedSearch ||
        student.firstName
          .toLowerCase()
          .includes(normalizedSearch) ||
        student.lastName
          .toLowerCase()
          .includes(normalizedSearch) ||
        student.admissionNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        student.universityEmail
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFaculty =
        !faculty ||
        student.faculty === faculty;

      return (
        matchesSearch &&
        matchesFaculty
      );
    });
  }, [data, search, faculty]);

  /*
   * --------------------------------
   * Columns
   * --------------------------------
   */

  const columns: Column[] = [
    {
      key: "studentId",
      header: "Admission number",
      render: (student) =>
        student.admissionNumber,
    },

    {
      key: "name",
      header: "Name",
      hideOnCard: true,
      render: (student) =>
        `${student.firstName} ${student.lastName}`,
    },

    {
      key: "faculty",
      header: "Faculty",
      render: (student) =>
        student.faculty,
    },

    {
      key: "course",
      header: "Course",
      render: (student) =>
        student.course,
    },

    {
      key: "status",
      header: "Status",
      render: (student) => (
        <StudentStatusBadge
          status={
            student.digitalIdCreated
              ? "active"
              : "pending"
          }
        />
      ),
    },

    {
      key: "actions",
      header: "Actions",
      align: "right",
      hideOnCard: true,
      render: (student) => (
        <Button
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation();
            handleStudentClick(student);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  /*
   * --------------------------------
   * Page numbers
   * --------------------------------
   */

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

  /*
   * --------------------------------
   * Render
   * --------------------------------
   */

  return (
    <div className="space-y-6">

      <PageHeader
        title="Students"
        description="Manage your student directory and their digital identities."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={
                <UploadIcon className="h-4 w-4" />
              }
              onClick={() =>
                setImportOpen(true)
              }
            >
              Import students
            </Button>

            <Button
              leftIcon={
                <PlusIcon className="h-4 w-4" />
              }
              onClick={() =>
                setAddOpen(true)
              }
            >
              Add student
            </Button>
          </>
        }
      />

      <Card>

        {/* -------------------------------- */}
        {/* Toolbar */}
        {/* -------------------------------- */}

        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">

          <div className="lg:max-w-xs lg:flex-1">
            <Input
              placeholder="Search by name or ID…"
              leftIcon={
                <SearchIcon className="h-4 w-4" />
              }
              aria-label="Search students"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              disabled={
                loading &&
                data.length === 0
              }
            />
          </div>

          <Select
            aria-label="Filter by faculty"
            className="lg:w-52"
            value={faculty}
            onChange={(e) =>
              setFaculty(e.target.value)
            }
            disabled={
              data.length === 0
            }
          >
            <option value="">
              All faculties
            </option>

            <option value="Engineering">
              Engineering
            </option>

            <option value="Science">
              Science
            </option>

            <option value="Arts & Humanities">
              Arts & Humanities
            </option>

            <option value="Business">
              Business
            </option>

            <option value="Medicine">
              Medicine
            </option>
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
              loading ||
              refreshing
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
          rowKey={(student) =>
            student.id
          }
          cardTitle={(student) =>
            `${student.firstName} ${student.lastName}`
          }
          onRowClick={handleStudentClick}
          empty={
            <EmptyState
              icon={
                <UsersIcon className="h-6 w-6" />
              }
              title={
                search || faculty
                  ? "No matching students"
                  : "No students yet"
              }
              description={
                search || faculty
                  ? "Try adjusting your search or filters."
                  : "Import your university student database to begin managing digital identities, or add a student manually."
              }
              primaryAction={
                !search &&
                !faculty ? (
                  <Button
                    leftIcon={
                      <UploadIcon className="h-4 w-4" />
                    }
                    onClick={() =>
                      setImportOpen(true)
                    }
                  >
                    Import students
                  </Button>
                ) : undefined
              }
              secondaryAction={
                !search &&
                !faculty ? (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setAddOpen(true)
                    }
                  >
                    Add manually
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
                students
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
                      disabled={
                        loading
                      }
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
      {/* Add student */}
      {/* -------------------------------- */}

      <AddStudentModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);

          // Refresh after closing
          fetchStudents();
        }}
      />

      {/* -------------------------------- */}
      {/* Import students */}
      {/* -------------------------------- */}

      <ImportStudentsModal
        open={importOpen}
        onClose={() => {
          setImportOpen(false);

          fetchStudents();
        }}
      />

      {/* -------------------------------- */}
      {/* Student details */}
      {/* -------------------------------- */}

      <StudentDetailsModal
        open={detailsOpen}
        student={selectedStudent}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedStudent(null);
        }}
      />

    </div>
  );
}