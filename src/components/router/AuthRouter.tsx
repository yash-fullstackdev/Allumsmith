import { Route, Routes } from 'react-router-dom';
import authRoutes from '../../routes/AuthRoutes';

const AuthRouter = () => {
	return (
		<Routes>
			{authRoutes.map((routeProps) => (
				<Route key={routeProps.path} {...routeProps} />
			))}
		</Routes>
	);
};

export default AuthRouter;
