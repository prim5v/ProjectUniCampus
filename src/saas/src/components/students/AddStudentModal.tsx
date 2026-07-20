




import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Input, Select } from "../ui/Input";

export function AddStudentModal({
  open,
  onClose



}: {open: boolean;onClose: () => void;}) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Persistence wires into the API layer later.
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 700);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add student"
      description="Create a single student record. Bulk records can be imported instead."
      size="lg"
      footer={
      <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" form="add-student-form" disabled={saving}>
            {saving ? "Adding…" : "Add student"}
          </Button>
        </>
      }>
      
      <form id="add-student-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="First name" required>
            {(p) => <Input placeholder="e.g. Amara" {...p} />}
          </FormField>
          <FormField label="Last name" required>
            {(p) => <Input placeholder="e.g. Okafor" {...p} />}
          </FormField>
        </div>
        <FormField label="Student ID" required hint="Your institution's enrolment identifier.">
          {(p) => <Input placeholder="e.g. UC-2026-0001" {...p} />}
        </FormField>
        <FormField label="University email" required>
          {(p) => <Input type="email" placeholder="student@university.edu" {...p} />}
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Faculty" required>
            {(p) =>
            <Select className="w-full" {...p}>
                <option value="">Select faculty</option>
                <option>Engineering</option>
                <option>Science</option>
                <option>Arts &amp; Humanities</option>
                <option>Business</option>
                <option>Medicine</option>
              </Select>
            }
          </FormField>
          <FormField label="Course">
            {(p) => <Input placeholder="e.g. Computer Science" {...p} />}
          </FormField>
        </div>
      </form>
    </Modal>);

}