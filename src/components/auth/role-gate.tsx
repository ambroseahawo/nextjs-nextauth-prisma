"use client";

import { userRole } from "@prisma/client";

import { FormError } from "@/components/form-error";
import { useCurrentRole } from "@/hooks/use-current-role";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: userRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="You do not have permission to view this content" />;
  }

  return <>{children}</>;
};
