import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  User,
  Hash,
  GraduationCap,
  CalendarDays,
  Mail,
  Building2,
  CreditCard,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { Student } from "../types";
import { useApi } from "../contexts/ApiContext";
import { useAuthContext } from "../contexts/AuthContext";

type LocationState = {
  student?: Student;
};

export function CreateDigitalId() {
  const location = useLocation();
  const navigate = useNavigate();

  const { student } = (location.state as LocationState) || {};
  const {api}= useApi();
  const { setLoading, setError, setMessage, setSuccessStatus } = useAuthContext();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [studentName, setStudentName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  const [universityEmail, setUniversityEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const faculties = [
  "ICT",
  "Medicine",
  "Engineering",
  "Business",
  "Education",
  "Law",
  "Health Sciences",
  "Social Sciences",
  "Humanities",
  "Science",
];

  /*
   * --------------------------------
   * Student guard
   * --------------------------------
   */

  if (!student) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create digital ID"
          description="No student record was provided."
          actions={
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/students")}
            >
              Back to students
            </Button>
          }
        />

        <Card>
          <div className="p-6">
            <p className="text-sm text-muted">
              The student record could not be loaded. Please return to the
              students page and select a student again.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * --------------------------------
   * Student name
   * --------------------------------
   */

  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  /*
   * --------------------------------
   * Image
   * --------------------------------
   */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (
    !studentName ||
    !admissionNumber ||
    !course ||
    !yearOfStudy ||
    !universityEmail ||
    !faculty ||
    !expiry
  ) {
    return;
  }

  try {
    setIsSubmitting(true);
    // setLoading(true);

    // const payload = {
    //   student_name: studentName.trim(),
    //   admission_number: admissionNumber.trim(),
    //   course: course.trim(),
    //   year_of_study: yearOfStudy,
    //   university_email: universityEmail.trim(),
    //   faculty,
    //   expiry,
    // };

    const formData = new FormData();

formData.append(
  "student_name",
  studentName.trim()
);

formData.append(
  "admission_number",
  admissionNumber.trim()
);

formData.append(
  "course",
  course.trim()
);

formData.append(
  "year_of_study",
  yearOfStudy
);

formData.append(
  "university_email",
  universityEmail.trim()
);

formData.append(
  "faculty",
  faculty
);

formData.append(
  "expiry",
  expiry
);


if (imageFile) {
  formData.append(
    "image",
    imageFile
  );
}

    // const response = await api.post(
    //   "/admin/create/digital/id",
    //   payload
    // );
    const response = await api.post(
      "/admin/create/digital/id",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );


    console.log("Digital ID created:", response.data);

    setSuccessStatus("success")

    setMessage(
      response.data?.message ||
      "Digital id created successfully"
    );

    navigate("/students");
    setError({})
  } catch (error) {
    console.error("Failed to create digital ID:", error);

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
      setSuccessStatus("error");
      setError(message);
  } finally {
    setIsSubmitting(false);
    // setLoading(false)
  }
};

  // const handleImageChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];

  //   if (!file) {
  //     return;
  //   }

  //   const preview = URL.createObjectURL(file);

  //   setImagePreview(preview);
  // };

  const handleImageChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  setImageFile(file);

  const preview = URL.createObjectURL(file);

  setImagePreview(preview);
};

  /*
   * --------------------------------
   * Render
   * --------------------------------
   */

  return (
    <div className="space-y-6">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <PageHeader
        title="Create digital ID"
        description={`Create a digital identity for ${fullName}.`}
        actions={
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/students")}
          >
            Back to students
          </Button>
        }
      />

      {/* -------------------------------- */}
      {/* Main content */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* -------------------------------- */}
        {/* Digital ID form */}
        {/* -------------------------------- */}

        <Card>
          <div className="border-b border-line p-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <CreditCard className="h-5 w-5 text-foreground" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Digital ID details
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Enter the information required for the student's
                  digital identity.
                </p>
              </div>

            </div>
          </div>

          {/* <div className="space-y-5 p-5"> */}
          <form onSubmit={handleSubmit} className="space-y-5 p-5">

            {/* -------------------------------- */}
            {/* Image */}
            {/* -------------------------------- */}

            <div>
              <label className="text-sm font-medium text-foreground">
                Student image

                <span className="ml-1 font-normal text-muted">
                  (optional)
                </span>
              </label>

              <div className="mt-3 flex items-center gap-4">

                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-gray-50">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Student preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-muted" />
                  )}

                </div>

                <div>

                  <label
                    htmlFor="student-image"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    Upload image
                  </label>

                  <input
                    id="student-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <p className="mt-2 text-xs text-muted">
                    Optional. JPG, PNG or WEBP.
                  </p>

                </div>

              </div>
            </div>

            {/* -------------------------------- */}
            {/* Student name */}
            {/* -------------------------------- */}

            <Input
              label="Student name"
              placeholder="Enter student name"
              value={studentName}
              onChange={(event) =>
                setStudentName(event.target.value)
              }
            />

            {/* -------------------------------- */}
            {/* Admission number */}
            {/* -------------------------------- */}

            <Input
              label="Admission number"
              placeholder="Enter admission number"
              value={admissionNumber}
              onChange={(event) =>
                setAdmissionNumber(event.target.value)
              }
            />

            <Input
              label="University email"
              type="email"
              placeholder="student@university.ac.ke"
              value={universityEmail}
              onChange={(event) => setUniversityEmail(event.target.value)}
            />

            <div>
                {/* <label
                  htmlFor="faculty"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Faculty
                </label> */}

                <select
                  id="faculty"
                  value={faculty}
                  onChange={(event) => setFaculty(event.target.value)}
                  className="w-full rounded-lg border border-line bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-foreground"
                >
                  <option value="">Select faculty</option>

                  {faculties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            {/* -------------------------------- */}
            {/* Course */}
            {/* -------------------------------- */}

            <Input
              label="Course"
              placeholder="Enter course"
              value={course}
              onChange={(event) =>
                setCourse(event.target.value)
              }
            />

            {/* -------------------------------- */}
            {/* Year of study */}
            {/* -------------------------------- */}

            <Input
              label="Year of study"
              placeholder="e.g. Year 2"
              value={yearOfStudy}
              onChange={(event) =>
                setYearOfStudy(event.target.value)
              }
            />

            <Input
              label="Expiry date"
              type="date"
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
            />

            {/* -------------------------------- */}
            {/* Action */}
            {/* -------------------------------- */}

            <div className="border-t border-line pt-5">

              {/* <Button className="w-full"> */}
              <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating digital ID..." : "Create digital ID"}
          {/* </Button> */}
                {/* Create digital ID */}
              </Button>

            </div>

          {/* </div> */}
          </form>
        </Card>

        {/* -------------------------------- */}
        {/* Existing student record */}
        {/* -------------------------------- */}

        <Card>

          <div className="border-b border-line p-5">

            <div>
              <h2 className="text-base font-semibold text-foreground">
                Student record
              </h2>

              <p className="mt-1 text-sm text-muted">
                Existing information from the student directory.
              </p>
            </div>

          </div>

          <div className="space-y-5 p-5">

            {/* -------------------------------- */}
            {/* Student identity */}
            {/* -------------------------------- */}

            <div className="flex items-center gap-4 rounded-lg border border-line p-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <User className="h-6 w-6 text-muted" />
              </div>

              <div className="min-w-0">

                <p className="text-lg font-semibold text-foreground">
                  {fullName}
                </p>

                <p className="mt-1 text-sm text-muted">
                  {student.admissionNumber}
                </p>

              </div>

            </div>

            {/* -------------------------------- */}
            {/* Record information */}
            {/* -------------------------------- */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <RecordField
                icon={<User className="h-4 w-4" />}
                label="Student"
                value={fullName}
              />

              <RecordField
                icon={<Hash className="h-4 w-4" />}
                label="Admission number"
                value={student.admissionNumber}
              />

              <RecordField
                icon={<Mail className="h-4 w-4" />}
                label="University email"
                value={student.universityEmail}
              />

              <RecordField
                icon={<Building2 className="h-4 w-4" />}
                label="Faculty"
                value={student.faculty}
              />

              <RecordField
                icon={<GraduationCap className="h-4 w-4" />}
                label="Course"
                value={student.course}
              />

              <RecordField
                icon={<CalendarDays className="h-4 w-4" />}
                label="Record expiry"
                value={student.expiry}
              />

            </div>

            {/* -------------------------------- */}
            {/* Current digital ID status */}
            {/* -------------------------------- */}

            <div className="rounded-lg border border-line p-4">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm font-medium text-foreground">
                    Digital ID status
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Current status of this student's digital identity.
                  </p>

                </div>

                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    student.digitalIdCreated
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {student.digitalIdCreated
                    ? "Created"
                    : "Not created"}
                </span>

              </div>

            </div>

          </div>

        </Card>

      </div>

    </div>
  );
}

/* -------------------------------- */
/* Record field */
/* -------------------------------- */

type RecordFieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
};

function RecordField({
  icon,
  label,
  value,
}: RecordFieldProps) {
  return (
    <div className="rounded-lg border border-line p-4">

      <div className="flex items-center gap-2 text-muted">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 break-all text-sm font-medium text-foreground">
        {value || "—"}
      </p>

    </div>
  );
}