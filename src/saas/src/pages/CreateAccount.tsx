import React, { useState } from "react";
import {
  ArrowRightIcon,
  Building2Icon,
  CheckIcon,
  CreditCardIcon,
  LibraryBigIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ClipboardCheckIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useApi } from "../contexts/ApiContext";
import { useAuthContext } from "../contexts/AuthContext";

const services = [
  {
    id: 1,
    slug: "access",
    name: "Access",
    description:
      "Manage secure campus entry and digital access.",
    icon: ShieldCheckIcon,
  },
  {
    id: 2,
    slug: "attendance",
    name: "Attendance",
    description:
      "Track and manage student attendance.",
    icon: ClipboardCheckIcon,
  },
  {
    id: 3,
    slug: "library",
    name: "Library Management",
    description:
      "Manage library activity, resources and access.",
    icon: LibraryBigIcon,
  },
  {
    id: 4,
    slug: "events",
    name: "Events",
    description:
      "Organize and manage campus events.",
    icon: CalendarDaysIcon,
  },
  {
    id: 5,
    slug: "payments",
    name: "Payments",
    description:
      "Manage campus payments and transactions.",
    icon: CreditCardIcon,
  },
];

const institutionTypes = [
  "University",
  "College",
  "TVET",
  "Other",
];

const populationRanges = [
  "Under 1,000",
  "1,000 – 5,000",
  "5,000 – 10,000",
  "10,000 – 25,000",
  "25,000+",
];

export function CreateAccount() {
  const navigate = useNavigate();
  const { api } = useApi();
  const { user, dbUser, setDbUser, setLoading } = useAuthContext();

  const [form, setForm] = useState({
    campusName: "",
    institutionType: "",
    estimatedPopulation: "",
    primaryPhone: "",
    secondaryPhone: "",
  });

  const [selectedServices, setSelectedServices] =
    useState<number[]>([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId]
    );
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError(null);
    setLoading(true);

    if (selectedServices.length === 0) {
      setError(
        "Please select at least one service."
      );
      return;
    }

    if (!form.primaryPhone.trim()) {
      setError(
        "Primary phone number is required."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        campus_name: form.campusName.trim(),
        institution_type: form.institutionType,
        estimated_population:
          form.estimatedPopulation,
        primary_phone:
          form.primaryPhone.trim(),
        secondary_phone:
          form.secondaryPhone.trim() || null,
        service_ids: selectedServices,
        email: user.primaryEmailAddress
              ?.emailAddress,
      };

      const response = await api.post(
        "/auth/create/campus/account",
        payload
      );

      console.log(
        "Campus created:",
        response.data
      );

      setDbUser(response.data.user ?? null)


      navigate("/");
    } catch (err: any) {
      console.error(
        "Failed to create campus:",
        err
      );

      const message =
        err?.response?.data?.error ??
        "Failed to create campus account.";

      setError(message);
      // setLoading(false);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
            <Building2Icon className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Create your campus
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-muted">
            Tell us about your institution and
            choose the UniCampus services you want
            to use.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Campus information */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-ink">
                Campus information
              </h2>

              <p className="mt-1 text-xs text-ink-muted">
                Basic information about your
                institution.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Campus name */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-ink">
                  Campus name
                </label>

                <input
                  type="text"
                  value={form.campusName}
                  onChange={(e) =>
                    updateField(
                      "campusName",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Zetech University"
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              {/* Institution type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Institution type
                </label>

                <select
                  value={form.institutionType}
                  onChange={(e) =>
                    updateField(
                      "institutionType",
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="">
                    Select type
                  </option>

                  {institutionTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Population */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Estimated student population
                </label>

                <select
                  value={
                    form.estimatedPopulation
                  }
                  onChange={(e) =>
                    updateField(
                      "estimatedPopulation",
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="">
                    Select population
                  </option>

                  {populationRanges.map(
                    (range) => (
                      <option
                        key={range}
                        value={range}
                      >
                        {range}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Primary phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Primary phone
                </label>

                <input
                  type="tel"
                  value={form.primaryPhone}
                  onChange={(e) =>
                    updateField(
                      "primaryPhone",
                      e.target.value
                    )
                  }
                  placeholder="+254 7XX XXX XXX"
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              {/* Secondary phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Secondary phone
                  <span className="ml-1 text-xs font-normal text-ink-muted">
                    (optional)
                  </span>
                </label>

                <input
                  type="tel"
                  value={form.secondaryPhone}
                  onChange={(e) =>
                    updateField(
                      "secondaryPhone",
                      e.target.value
                    )
                  }
                  placeholder="+254 7XX XXX XXX"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          </Card>

          {/* Services */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-ink">
                Choose your services
              </h2>

              <p className="mt-1 text-xs text-ink-muted">
                Select the UniCampus services
                your institution wants to use.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {services.map((service) => {
                const selected =
                  selectedServices.includes(
                    service.id
                  );

                const Icon = service.icon;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() =>
                      toggleService(
                        service.id
                      )
                    }
                    className={[
                      "group relative flex items-start gap-4 rounded-xl border p-4 text-left transition-colors",
                      selected
                        ? "border-brand-300 bg-brand-50/50"
                        : "border-line bg-surface hover:border-brand-200 hover:bg-brand-50/40",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                        selected
                          ? "bg-brand-100 text-brand-600"
                          : "bg-slate-50 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-ink">
                          {service.name}
                        </span>

                        <span
                          className={[
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                            selected
                              ? "border-brand-600 bg-brand-600 text-white"
                              : "border-line bg-surface",
                          ].join(" ")}
                        >
                          {selected && (
                            <CheckIcon className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-ink-muted">
                        {service.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedServices.length === 0 && (
              <p className="mt-4 text-xs text-ink-muted">
                Select at least one service to
                continue.
              </p>
            )}
          </Card>

          {/* Trial */}
          <Card className="border-brand-100 bg-brand-50/40 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <CreditCardIcon className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-ink">
                  Start with a 30-day free trial
                </h2>

                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  Try the services you select for
                  30 days. You can configure your
                  subscription after your trial
                  period.
                </p>

                <p className="mt-3 text-xs font-medium text-brand-600">
                  No payment is required to start
                  your trial.
                </p>
              </div>
            </div>
          </Card>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>

            <Button
              type="submit"
              disabled={
                submitting ||
                selectedServices.length === 0
              }
              rightIcon={
                <ArrowRightIcon className="h-4 w-4" />
              }
            >
              {submitting
                ? "Creating campus..."
                : "Create campus"}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-ink-muted">
          Your campus workspace will be created
          with the services you selected.
        </p>
      </div>
    </div>
  );
}