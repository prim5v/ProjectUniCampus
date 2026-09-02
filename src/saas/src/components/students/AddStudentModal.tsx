import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Input, Select } from "../ui/Input";
import { useApi } from "../../contexts/ApiContext";
import { useAuthContext } from "../../contexts/AuthContext";

type FormData = {
  first_name: string;
  middle_name: string;
  last_name: string;
  admission_number: string;
  university_email: string;
  faculty: string;
  course: string;
  expiry: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  first_name: "",
  middle_name: "",
  last_name: "",
  admission_number: "",
  university_email: "",
  faculty: "",
  course: "",
  expiry: "",
};

export function AddStudentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const { api } = useApi();
  const { setLoading, setError, setMessage, setSuccessStatus } = useAuthContext();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the field's validation error when the user edits it
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Clear API messages when the user starts editing again
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const firstName = formData.first_name.trim();
    const middleName = formData.middle_name.trim();
    const lastName = formData.last_name.trim();
    const admissionNumber = formData.admission_number.trim();
    const email = formData.university_email.trim();
    const faculty = formData.faculty.trim();
    const course = formData.course.trim();
    const expiry = formData.expiry.trim();

    // --------------------------------
    // FIRST NAME
    // --------------------------------

    if (!firstName) {
      newErrors.first_name = "First name is required.";
    } else if (firstName.length < 2) {
      newErrors.first_name =
        "First name must be at least 2 characters.";
    } else if (!/^[A-Za-zÀ-ÿ' -]+$/.test(firstName)) {
      newErrors.first_name =
        "First name contains invalid characters.";
    }

    // --------------------------------
    // MIDDLE NAME - OPTIONAL
    // --------------------------------

    if (middleName) {
      if (middleName.length < 2) {
        newErrors.middle_name =
          "Middle name must be at least 2 characters.";
      } else if (!/^[A-Za-zÀ-ÿ' -]+$/.test(middleName)) {
        newErrors.middle_name =
          "Middle name contains invalid characters.";
      }
    }

    // --------------------------------
    // LAST NAME
    // --------------------------------

    if (!lastName) {
      newErrors.last_name = "Last name is required.";
    } else if (lastName.length < 2) {
      newErrors.last_name =
        "Last name must be at least 2 characters.";
    } else if (!/^[A-Za-zÀ-ÿ' -]+$/.test(lastName)) {
      newErrors.last_name =
        "Last name contains invalid characters.";
    }

    // --------------------------------
    // ADMISSION NUMBER
    // --------------------------------

    if (!admissionNumber) {
      newErrors.admission_number =
        "Admission / registration number is required.";
    } else if (admissionNumber.length < 2) {
      newErrors.admission_number =
        "Admission / registration number is too short.";
    }

    // --------------------------------
    // UNIVERSITY EMAIL
    // --------------------------------

    if (!email) {
      newErrors.university_email =
        "University email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.university_email =
        "Enter a valid university email address.";
    }

    // --------------------------------
    // FACULTY
    // --------------------------------

    if (!faculty) {
      newErrors.faculty = "Please select a faculty.";
    }

    // --------------------------------
    // COURSE
    // --------------------------------

    if (!course) {
      newErrors.course = "Course is required.";
    } else if (course.length < 2) {
      newErrors.course =
        "Course must be at least 2 characters.";
    }

    // --------------------------------
    // EXPIRY
    // --------------------------------

    if (!expiry) {
      newErrors.expiry = "Expiry date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // Stop before making the API request
    if (!validateForm()) {
      setErrorMessage(
        "Please correct the highlighted fields before continuing."
      );
      return;
    }

    try {
      setSaving(true);
      setLoading(true);

      const payload = {
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim() || null,
        last_name: formData.last_name.trim(),
        admission_number: formData.admission_number.trim(),
        university_email: formData.university_email.trim(),
        faculty: formData.faculty.trim(),
        course: formData.course.trim(),
        expiry: formData.expiry,
      };

      const response = await api.post(
        "/admin/add/single/student",
        payload
      );

      console.log("Student added:", response.data);

      setSuccessStatus("success")

      setSuccessMessage(
        response.data?.message ||
          "Student added successfully."
      );
      setMessage(
        response.data?.message ||
          "Student added successfully."
      );

      // Reset form after successful submission
      setFormData(initialFormData);
      setErrors({});
      setError({})
    } catch (error: unknown) {
      console.error("Failed to add student:", error);

      let message =
        "Something went wrong while adding the student.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message =
          axiosError.response?.data?.message || message;
      }

      setErrorMessage(message);
      setSuccessStatus("error");
      setError(message);
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;

    setErrorMessage("");
    setSuccessMessage("");
    setError({})
    setMessage("")
    setErrors({});
    setFormData(initialFormData);

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add student"
      description="Create a single student record. Bulk records can be imported instead."
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="add-student-form"
            disabled={saving}
          >
            {saving ? "Adding…" : "Add student"}
          </Button>
        </>
      }
    >
      <form
        id="add-student-form"
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="First name"
            required
            hint={errors.first_name}
          >
            {(p) => (
              <Input
                {...p}
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="e.g. Amara"
                autoComplete="given-name"
                aria-invalid={!!errors.first_name}
              />
            )}
          </FormField>

          <FormField
            label="Middle name"
            hint={errors.middle_name || "Optional"}
          >
            {(p) => (
              <Input
                {...p}
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="e.g. Grace"
                autoComplete="additional-name"
                aria-invalid={!!errors.middle_name}
              />
            )}
          </FormField>

          <FormField
            label="Last name"
            required
            hint={errors.last_name}
          >
            {(p) => (
              <Input
                {...p}
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="e.g. Okafor"
                autoComplete="family-name"
                aria-invalid={!!errors.last_name}
              />
            )}
          </FormField>
        </div>

        {/* Admission number */}
        <FormField
          label="Admission / registration number"
          required
          hint={
            errors.admission_number ||
            "The identifier assigned to the student by your institution."
          }
        >
          {(p) => (
            <Input
              {...p}
              name="admission_number"
              value={formData.admission_number}
              onChange={handleChange}
              placeholder="e.g. SCT211-0001"
              aria-invalid={!!errors.admission_number}
            />
          )}
        </FormField>

        {/* University email */}
        <FormField
          label="University email"
          required
          hint={errors.university_email}
        >
          {(p) => (
            <Input
              {...p}
              type="email"
              name="university_email"
              value={formData.university_email}
              onChange={handleChange}
              placeholder="e.g. student@university.edu"
              autoComplete="email"
              aria-invalid={!!errors.university_email}
            />
          )}
        </FormField>

        {/* Faculty + Course */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Faculty"
            required
            hint={errors.faculty}
          >
            {(p) => (
              <Select
                {...p}
                className="w-full"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                aria-invalid={!!errors.faculty}
              >
                <option value="">Select faculty</option>
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
                <option value="SICTM&E">
                  SICTM&E
                </option>
              </Select>
            )}
          </FormField>

          <FormField
            label="Course"
            required
            hint={errors.course}
          >
            {(p) => (
              <Input
                {...p}
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                aria-invalid={!!errors.course}
              />
            )}
          </FormField>
        </div>

        {/* Expiry */}
        <FormField
          label="Student record expiry"
          required
          hint={
            errors.expiry ||
            "The date when this student's record expires."
          }
        >
          {(p) => (
            <Input
              {...p}
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              aria-invalid={!!errors.expiry}
            />
          )}
        </FormField>

        {/* Error message */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span className="mt-0.5 font-semibold">
              ✕
            </span>

            <div>
              <p className="font-medium">
                Unable to add student
              </p>

              <p className="mt-0.5">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            <span className="mt-0.5 font-semibold">
              ✓
            </span>

            <div>
              <p className="font-medium">
                Student added
              </p>

              <p className="mt-0.5">
                {successMessage}
              </p>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}