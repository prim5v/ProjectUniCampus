





import React, { useState } from "react";
import { SearchIcon, PlusIcon, UploadIcon, UsersIcon, FilterIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import { DataTable, type Column } from "../components/ui/DataTable";
import { StudentStatusBadge } from "../lib/status";
import { useCollection } from "../hooks/useCollection";
import { getStudents } from "../services/data";
import type { Student } from "../types";
import { AddStudentModal } from "../components/students/AddStudentModal";
import { ImportStudentsModal } from "../components/students/ImportStudentsModal";

export function Students() {
  const { data, loading } = useCollection(getStudents);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const columns: Column<Student>[] = [
  {
    key: "studentId",
    header: "Student ID",
    render: (s) => <span className="font-medium text-ink">{s.studentId}</span>
  },
  {
    key: "name",
    header: "Name",
    hideOnCard: true,
    render: (s) => `${s.firstName} ${s.lastName}`
  },
  { key: "faculty", header: "Faculty", render: (s) => s.faculty },
  { key: "course", header: "Course", render: (s) => s.course },
  {
    key: "status",
    header: "Status",
    render: (s) => <StudentStatusBadge status={s.status} />
  },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    hideOnCard: true,
    render: () =>
    <Button variant="ghost" size="sm">
          View
        </Button>

  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage your student directory and their digital identities."
        actions={
        <>
            <Button
            variant="secondary"
            leftIcon={<UploadIcon className="h-4 w-4" />}
            onClick={() => setImportOpen(true)}>
            
              Import students
            </Button>
            <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setAddOpen(true)}>
            
              Add student
            </Button>
          </>
        } />
      

      <Card>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <div className="sm:max-w-xs sm:flex-1">
            <Input
              placeholder="Search by name or ID…"
              leftIcon={<SearchIcon className="h-4 w-4" />}
              aria-label="Search students"
              disabled={!loading && data.length === 0} />
            
          </div>
          <Select
            aria-label="Filter by faculty"
            className="sm:w-44"
            disabled={!loading && data.length === 0}>
            
            <option>All faculties</option>
          </Select>
          <Button
            variant="secondary"
            leftIcon={<FilterIcon className="h-4 w-4" />}
            className="sm:ml-auto"
            disabled={!loading && data.length === 0}>
            
            Filters
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowKey={(s) => s.id}
          cardTitle={(s) => `${s.firstName} ${s.lastName}`}
          empty={
          <EmptyState
            icon={<UsersIcon className="h-6 w-6" />}
            title="No students yet"
            description="Import your university student database to begin managing digital identities, or add a student manually."
            primaryAction={
            <Button
              leftIcon={<UploadIcon className="h-4 w-4" />}
              onClick={() => setImportOpen(true)}>
              
                  Import students
                </Button>
            }
            secondaryAction={
            <Button variant="secondary" onClick={() => setAddOpen(true)}>
                  Add manually
                </Button>
            } />

          } />
        
      </Card>

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ImportStudentsModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>);

}