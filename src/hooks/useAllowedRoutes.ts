import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const useAllowedRoutes = (contentRoutes: any, isContentRoutes: boolean) => {
	const [allowedRoutes, setAllowedRoutes] = useState<any>([]);
	const { user }: any = useUser();
	localStorage.setItem('userId', user?.id);

	useEffect(() => {
		const permissions = user?.publicMetadata?.permissions || '{}';

		if (isContentRoutes) {
			// Filter contentRoutes based on permissions for each set of routes
			const matchedRoutes = contentRoutes?.filter((route: any) => {
				return permissions[`/${route.path.split('/')[1]}`];
			});
			setAllowedRoutes(matchedRoutes);
		} else {
			// Filter asideRoutes based on permissions for each set of routes
			const filteredRoutes = contentRoutes?.filter((route: any) => {
				if (route.userPermissionPage) {
					return permissions[route?.userPermissionPage?.to];
				}
				return permissions[route?.path || route?.listPage?.to];
			});

			setAllowedRoutes(filteredRoutes);
		}
	}, [user]);

	return allowedRoutes;
};

export default useAllowedRoutes;
