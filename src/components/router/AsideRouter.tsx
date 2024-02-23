import React from 'react';
import { Route, Routes } from 'react-router-dom';
import asideRoutes from '../../routes/asideRoutes';

const AsideRouter = () => {
	return (
		<Routes>
			{asideRoutes.map((routeProps) => (
				<Route key={routeProps.path} {...routeProps} />
			))}
		</Routes>
	);
};

export default AsideRouter;
