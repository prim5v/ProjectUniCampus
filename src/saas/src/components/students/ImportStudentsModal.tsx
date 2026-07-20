




import React, { useState } from "react";
import { UploadCloudIcon, FileSpreadsheetIcon } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export function ImportStudentsModal({
  open,
  onClose



}: {open: boolean;onClose: () => void;}) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Modal
      open={open}
      onClose={() => {
        setFile(null);
        onClose();
      }}
      title="Import students"
      description="Upload a CSV export from your student information system."
      footer={
      <>
          <Button
          variant="secondary"
          type="button"
          onClick={() => {
            setFile(null);
            onClose();
          }}>
          
            Cancel
          </Button>
          <Button disabled={!file}>Start import</Button>
        </>
      }>
      
      <div className="space-y-4">
        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-slate-50 px-6 py-10 text-center hover:border-brand-300 hover:bg-brand-50/30 transition-colors">
          
          <UploadCloudIcon className="h-8 w-8 text-slate-400" />
          <span className="mt-3 text-sm font-medium text-ink">
            {file ? file.name : "Click to upload or drag a file here"}
          </span>
          <span className="mt-1 text-xs text-ink-muted">CSV up to 20MB</span>
          <input
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          
        </label>

        <div className="flex items-start gap-3 rounded-lg border border-line bg-white p-3">
          <FileSpreadsheetIcon className="h-5 w-5 shrink-0 text-brand-600" />
          <div className="text-sm">
            <p className="font-medium text-ink">Need the format?</p>
            <p className="text-ink-muted">
              Your file should include columns for student ID, name, email, faculty
              and course.{" "}
              <button className="font-medium text-brand-600 hover:underline">
                Download template
              </button>
            </p>
          </div>
        </div>
      </div>
    </Modal>);

}