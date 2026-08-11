import type {
  Student,
  DigitalId,
  Reader,
  Building,
  AttendanceSession,
  Announcement,
  ActivityItem,
  SetupStep,
  SystemService,
} from "../types";

/**
 * Data access layer for UniCampus.
 *
 * Backend/API integration lives here.
 * UI components should not need to know the backend
 * response format.
 */

/* -------------------------------- */
/* Generic empty data helper */
/* -------------------------------- */

const EMPTY = <T,>(): Promise<T[]> =>
  Promise.resolve([]);


/* -------------------------------- */
/* Students */
/* -------------------------------- */

export type StudentsPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

export type StudentsResponse = {
  success: boolean;
  message: string;
  data: Student[];
  pagination: StudentsPagination;
};

type BackendStudent = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  admission_number: string;
  university_email: string;
  faculty: string;
  course: string;
  expiry: string;
  digitalId_created: boolean;
  created_at: string | null;
};


/**
 * Get paginated students from the backend.
 *
 * Example:
 *
 * GET /admin/get/students/data?page=1&limit=20
 */
export const getStudents = async (
  api: any,
  page = 1,
  limit = 20
): Promise<StudentsResponse> => {

  const response = await api.get(
    "/admin/get/students/data",
    {
      params: {
        page,
        limit,
      },
    }
  );

  const backendStudents: BackendStudent[] =
    response.data?.data ?? [];


  /*
   * Convert backend snake_case into
   * frontend camelCase.
   */

  const students: Student[] =
    backendStudents.map((student) => ({
      id: student.id,

      firstName:
        student.first_name,

      middleName:
        student.middle_name,

      lastName:
        student.last_name,

      admissionNumber:
        student.admission_number,

      universityEmail:
        student.university_email,

      faculty:
        student.faculty,

      course:
        student.course,

      expiry:
        student.expiry,

      digitalIdCreated:
        student.digitalId_created,

      createdAt:
        student.created_at,
    }));


  return {
    success:
      response.data?.success ?? true,

    message:
      response.data?.message ??
      "Students retrieved successfully.",

    data: students,

    pagination:
      response.data?.pagination ?? {
        page,
        limit,
        total: students.length,
        total_pages: 1,
        has_next: false,
        has_previous: page > 1,
      },
  };
};


/* -------------------------------- */
/* Other data */
/* -------------------------------- */

export const getDigitalIds =
  (): Promise<DigitalId[]> =>
    EMPTY();

export const getReaders =
  (): Promise<Reader[]> =>
    EMPTY();

export const getBuildings =
  (): Promise<Building[]> =>
    EMPTY();

export const getSessions =
  (): Promise<AttendanceSession[]> =>
    EMPTY();

export const getAnnouncements =
  (): Promise<Announcement[]> =>
    EMPTY();

export const getRecentActivity =
  (): Promise<ActivityItem[]> =>
    EMPTY();


/* -------------------------------- */
/* Onboarding checklist */
/* -------------------------------- */

/**
 * Onboarding checklist.
 *
 * The university profile is created during signup,
 * so it starts complete. Everything else is pending
 * until configured.
 */

export const getSetupSteps =
  (): Promise<SetupStep[]> =>
    Promise.resolve([
      {
        id: "profile",
        label: "Create university profile",
        description:
          "Institution name, domain and primary administrator.",
        completed: true,
        href: "/settings",
      },

      {
        id: "buildings",
        label: "Add campus locations",
        description:
          "Register the buildings and sites you operate.",
        completed: false,
        href: "/buildings",
      },

      {
        id: "students",
        label: "Import students",
        description:
          "Bring in your student database to issue digital identities.",
        completed: false,
        href: "/students",
      },

      {
        id: "readers",
        label: "Register reader devices",
        description:
          "Connect NFC/QR readers across your campus.",
        completed: false,
        href: "/readers",
      },

      {
        id: "attendance",
        label: "Configure attendance",
        description:
          "Set the rules that govern how attendance is recorded.",
        completed: false,
        href: "/attendance",
      },
    ]);


/* -------------------------------- */
/* System services */
/* -------------------------------- */

export const getSystemServices =
  (): Promise<SystemService[]> =>
    Promise.resolve([
      {
        id: "identity",
        name: "Identity service",
        status: "operational",
        detail: "Ready to issue credentials",
      },

      {
        id: "readers",
        name: "Reader network",
        status: "not_configured",
        detail: "No readers registered",
      },

      {
        id: "attendance",
        name: "Attendance engine",
        status: "not_configured",
        detail: "Awaiting configuration",
      },

      {
        id: "api",
        name: "API & webhooks",
        status: "operational",
        detail: "Endpoints available",
      },
    ]);