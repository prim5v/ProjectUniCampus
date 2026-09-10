import React, { useState, useCallback } from "react";

import {
  PlusIcon,
  Building2Icon,
  CpuIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { PageHeader } from "../components/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { Modal } from "../components/ui/Modal";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { useAuthContext } from "../contexts/AuthContext";

import { useCollection } from "../hooks/useCollection";
import { getBuildings } from "../services/data";
import { useApi } from "../contexts/ApiContext";
import axios from "axios";

export function Buildings() {
  const { api } = useApi();

  const fetchBuildings = useCallback(
    () => getBuildings(api),
    [api]
  );

  const {
    data,
    loading,
    refresh,
  } = useCollection(fetchBuildings);

  const [open, setOpen] = useState(false);

  const { setLoading, setError, setMessage, setSuccessStatus } = useAuthContext();

  const [buildingName, setBuildingName] =
    useState("");

  const [buildingCode, setBuildingCode] =
    useState("");

  const [buildingAddress, setBuildingAddress] =
    useState("");

  const [adding, setAdding] =
    useState(false);

  const addBuilding = async () => {
    /* ----------------------------- */
    /* Validate */
    /* ----------------------------- */

    if (!buildingName.trim()) {
      alert("Building name is required.");
      return;
    }

    if (!buildingCode.trim()) {
      alert("Building code is required.");
      return;
    }

    if (!buildingAddress.trim()) {
      alert("Building address is required.");
      return;
    }

    /* ----------------------------- */
    /* Payload */
    /* ----------------------------- */

    const payload = {
      name: buildingName.trim(),
      code: buildingCode.trim().toUpperCase(),
      address: buildingAddress.trim(),
    };

    console.log("Adding building:", payload);

    try {
      setAdding(true);
      // setLoading(true)

      const response = await api.post(
        "/admin/add/building",
        payload
      );

      console.log(
        "Add building response:",
        response.data
      );

      if (response.data?.success) {
        /* ----------------------------- */
        /* Reset form */
        /* ----------------------------- */

        setBuildingName("");
        setBuildingCode("");
        setBuildingAddress("");
        setSuccessStatus("success");
        setMessage(
          response.data?.message ||
          "Building added successfully"
        );

        setError({});

        /* ----------------------------- */
        /* Close modal */
        /* ----------------------------- */

        setOpen(false);

        /*
         * For now reload the page so the
         * building list gets the new data.
         *
         * We can later replace this with
         * useCollection refresh().
         */
        // window.location.reload();
        refresh();
      } else {
        alert(
          response.data?.message ??
            "Failed to add building."
        );
        setError(response.data?.message);
        setSuccessStatus("error")
      }
    } catch (error: any) {
      console.error(
        "Failed to add building:",
        error?.response?.data || error
      );
      let message =
      "Something went wrong while adding building.";

      const axiosError = error as {
        response?: {
          data?:{
            message?: string;
          };
        };
      };

      message = axiosError.response?.data?.message || message;
      setError(message);

      alert(
        error?.response?.data?.message ??
          "Failed to add building."
      );
    } finally {
      setLoading(false)
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <PageHeader
        title="Buildings"
        description="Manage campus locations, assigned readers and access permissions."
        actions={
          <Button
            leftIcon={
              <PlusIcon className="h-4 w-4" />
            }
            onClick={() => setOpen(true)}
          >
            Add building
          </Button>
        }
      />

      {/* -------------------------------- */}
      {/* Loading */}
      {/* -------------------------------- */}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {Array.from({ length: 3 }).map(
            (_, i) => (
              <Card
                key={i}
                className="p-5 space-y-3"
              >
                <Skeleton className="h-5 w-32" />

                <Skeleton className="h-4 w-full" />

                <Skeleton className="h-4 w-24" />
              </Card>
            )
          )}

        </div>

      ) : data.length === 0 ? (

        /* -------------------------------- */
        /* Empty */
        /* -------------------------------- */

        <Card>
          <CardBody className="p-0">

            <EmptyState
              icon={
                <Building2Icon className="h-6 w-6" />
              }
              title="No campus locations added"
              description="Add the buildings and sites you operate, then assign readers and configure access permissions for each."
              primaryAction={
                <Button
                  leftIcon={
                    <PlusIcon className="h-4 w-4" />
                  }
                  onClick={() => setOpen(true)}
                >
                  Add building
                </Button>
              }
            />

          </CardBody>
        </Card>

      ) : (

        /* -------------------------------- */
        /* Buildings */
        /* -------------------------------- */

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {data.map((b) => (

            <Card
              key={b.id}
              className="p-5"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">

                  <Building2Icon className="h-5 w-5" />

                </div>

                <Badge tone="neutral">
                  {b.code}
                </Badge>

              </div>

              <h3 className="mt-3 text-sm font-semibold text-ink">
                {b.name}
              </h3>

              <p className="text-sm text-ink-muted">
                {b.address}
              </p>

              <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-xs text-ink-muted">

                <span className="inline-flex items-center gap-1.5">

                  <CpuIcon className="h-3.5 w-3.5" />

                  {b.readerCount ?? 0} readers

                </span>

                <span className="inline-flex items-center gap-1.5">

                  <ShieldCheckIcon className="h-3.5 w-3.5" />

                  {b.accessGroups ?? 0} groups

                </span>

              </div>

            </Card>

          ))}

        </div>
      )}

      {/* -------------------------------- */}
      {/* Add Building Modal */}
      {/* -------------------------------- */}

      <Modal
        open={open}
        onClose={() => {
          if (!adding) {
            setOpen(false);
          }
        }}
        title="Add building"
        description="Register a new campus location."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={adding}
            >
              Cancel
            </Button>

            <Button
              onClick={addBuilding}
              disabled={
                adding ||
                !buildingName.trim() ||
                !buildingCode.trim() ||
                !buildingAddress.trim()
              }
            >
              {adding
                ? "Adding..."
                : "Add building"}
            </Button>
          </>
        }
      >

        <div className="space-y-5">

          {/* Building Name */}

          <FormField
            label="Building name"
            value={buildingName}
            required
          >
            {(p) => (
              <Input
                {...p}
                value={buildingName}
                onChange={(e) =>
                  setBuildingName(
                    e.target.value
                  )
                }
                placeholder="e.g. Science Block A"
              />
            )}
          </FormField>

          {/* Building Code */}

          <FormField
            label="Building code"
            value={buildingCode}
            required
            hint="A short identifier used on devices and reports."
          >
            {(p) => (
              <Input
                {...p}
                value={buildingCode}
                onChange={(e) =>
                  setBuildingCode(
                    e.target.value
                  )
                }
                placeholder="e.g. SBA"
              />
            )}
          </FormField>

          {/* Address */}

          <FormField
            label="Address"
            value={buildingAddress}
            required
          >
            {(p) => (
              <Input
                {...p}
                value={buildingAddress}
                onChange={(e) =>
                  setBuildingAddress(
                    e.target.value
                  )
                }
                placeholder="Street, campus, city"
              />
            )}
          </FormField>

        </div>

      </Modal>

    </div>
  );
}