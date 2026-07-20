











import React from "react";
import { useNavigate } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import { Card, CardBody } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardBody className="p-0">
        <EmptyState
          icon={<CompassIcon className="h-6 w-6" />}
          title="Page not found"
          description="The page you're looking for doesn't exist or has been moved."
          primaryAction={<Button onClick={() => navigate("/")}>Back to dashboard</Button>} />
        
      </CardBody>
    </Card>);

}