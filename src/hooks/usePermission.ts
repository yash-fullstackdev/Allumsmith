import { useUser } from '@clerk/clerk-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';


const usePermissions = () => {
  const { user } = useUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const permissions = useMemo(() => {
    const permissionsCred:any = user?.publicMetadata?.permissionsCred;
    if (!permissionsCred) return { read: false, write: false, delete: false };

    return permissionsCred[currentPath] || { read: false, write: false, delete: false };
  }, [user, currentPath]);

  return permissions;
};

export default usePermissions;