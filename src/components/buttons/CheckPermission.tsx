import usePermissions from "../../hooks/usePermission"


interface PermissionGuardProps {
  permissionType: "read" | "write" | "delete";
  children: React.ReactNode;
}

const PermissionGuard = ({permissionType,children}:PermissionGuardProps) => {
    const permission = usePermissions()
    const hasPermission = permission?.[permissionType]

    if(hasPermission) {
      return <>{children}</>;
    }
  
    return null;
}

export default PermissionGuard