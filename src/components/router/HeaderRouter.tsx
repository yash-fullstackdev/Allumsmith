import React from 'react';
import { Route, Routes } from 'react-router-dom';
import headerRoutes from '../../routes/headerRoutes';

const HeaderRouter = () => {
	return (
		<Routes>
			{headerRoutes.map((routeProps) => (
				<Route key={routeProps.path} {...routeProps} />
			))}
		</Routes>
	);
};

export default HeaderRouter;
