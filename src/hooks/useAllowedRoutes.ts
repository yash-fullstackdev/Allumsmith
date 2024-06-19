import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming you are using React Router

const useAllowedRoutes = (contentRoutes: any, isContentRoutes: boolean) => {
	const [allowedRoutes, setAllowedRoutes] = useState<any>([]);

	useEffect(() => {
		const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');

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
					console.log(route?.userPermissionPage?.to, 'route?.userPermissionPage?.to');
					return permissions[route?.userPermissionPage?.to];
				}
				return permissions[route?.path || route?.listPage?.to];
			});

			setAllowedRoutes(filteredRoutes);
		}
	}, []);

	return allowedRoutes;
};

export default useAllowedRoutes;
