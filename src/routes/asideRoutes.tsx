import { RouteProps } from 'react-router-dom';
import DefaultAsideTemplate from '../templates/layouts/Asides/DefaultAside.template';

const asideRoutes: RouteProps[] = [{ path: '*', element: <DefaultAsideTemplate /> }];

export default asideRoutes;
