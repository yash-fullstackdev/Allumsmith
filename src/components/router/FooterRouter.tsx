import React from 'react';
import { Route, Routes } from 'react-router-dom';
import footerRoutes from '../../routes/footerRoutes';

const FooterRouter = () => {
	return (
		<Routes>
			{footerRoutes.map((routeProps) => (
				<Route key={routeProps.path} {...routeProps} />
			))}
		</Routes>
	);
};

export default FooterRouter;
