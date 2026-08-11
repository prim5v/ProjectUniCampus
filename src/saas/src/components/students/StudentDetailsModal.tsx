import React from "react";
import {
  Mail,
  GraduationCap,
  Hash,
  CalendarDays,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import type { Student } from "../../types";
import { Link } from "react-router-dom";

type StudentDetailsModalProps = {
  open: boolean;
  student: Student | null;
  onClose: () => void;
};

export function StudentDetailsModal({
  open,
  student,
  onClose,
}: StudentDetailsModalProps) {
  if (!student) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Student details"
      description="View the complete student record."
      size="lg"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Close
        </button>
      }
    >
      <div className="space-y-6">

        {/* -------------------------------- */}
        {/* Name */}
        {/* -------------------------------- */}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Student
          </p>

          <h2 className="mt-1 text-xl font-semibold text-foreground">
            {student.firstName}{" "}
            {student.middleName
              ? `${student.middleName} `
              : ""}
            {student.lastName}
          </h2>

          <Link
            to={`/students/${student.id}/digital-id`}
            state={{ student }}
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            View the complete student record
          </Link>
        </div>

        {/* -------------------------------- */}
        {/* Student information */}
        {/* -------------------------------- */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Admission number */}

          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-muted">
              <Hash className="h-4 w-4" />

              <span className="text-xs font-medium">
                Admission number
              </span>
            </div>

            <p className="mt-2 text-sm font-medium">
              {student.admissionNumber}
            </p>
          </div>

          {/* University email */}

          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-muted">
              <Mail className="h-4 w-4" />

              <span className="text-xs font-medium">
                University email
              </span>
            </div>

            <p className="mt-2 break-all text-sm font-medium">
              {student.universityEmail}
            </p>
          </div>

          {/* Faculty */}

          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-muted">
              <GraduationCap className="h-4 w-4" />

              <span className="text-xs font-medium">
                Faculty
              </span>
            </div>

            <p className="mt-2 text-sm font-medium">
              {student.faculty}
            </p>
          </div>

          {/* Course */}

          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-muted">
              <GraduationCap className="h-4 w-4" />

              <span className="text-xs font-medium">
                Course
              </span>
            </div>

            <p className="mt-2 text-sm font-medium">
              {student.course}
            </p>
          </div>

          {/* Record expiry */}

          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-muted">
              <CalendarDays className="h-4 w-4" />

              <span className="text-xs font-medium">
                Record expiry
              </span>
            </div>

            <p className="mt-2 text-sm font-medium">
              {student.expiry}
            </p>
          </div>

          {/* Digital ID */}

          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-medium text-muted">
              Digital ID
            </p>

            <p className="mt-2 text-sm font-medium">
              {student.digitalIdCreated
                ? "Created"
                : "Not created"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}