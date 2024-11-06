"use client";

import { userRole } from "@prisma/client";
import { toast } from "sonner";

import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { admin } from "@/actions/admin";

const AdminPage = () => {
  const onAPIRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Allowed API Route");
      } else {
        toast.error("Forbidden API Route");
      }
    });
  };

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) toast.error(data.error);
      if (data.success) toast.error(data.success);
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent>
        <RoleGate allowedRole={userRole.ADMIN}>
          <FormSuccess message="You are an admin" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin only API Route</p>
          <Button onClick={onAPIRouteClick}> Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin only Server Action</p>
          <Button onClick={onServerActionClick}> Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
