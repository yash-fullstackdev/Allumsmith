import { useEffect, useState } from 'react';

const useAllowedRoutes = (contentRoutes: any) => {
	const [allowedRoutes, setAllowedRoutes] = useState<any>([]);

	useEffect(() => {
		const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');

		// Filter contentRoutes based on permissions for each set of routes
		const filteredRoutes = contentRoutes?.filter((route: any) => {
			return permissions[route?.path || route?.listPage?.to];
		});

		setAllowedRoutes(filteredRoutes);
	}, [contentRoutes]); // Dependency on contentRoutes to re-filter when it changes

	return allowedRoutes;
};

export default useAllowedRoutes;
