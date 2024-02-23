import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface IPortalProps {
	children: ReactNode;
	id?: string;
}
const Portal: FC<IPortalProps> = ({ id, children }) => {
	const mount = document.getElementById(id as string);
	if (mount) return ReactDOM.createPortal(children, mount);
	return null;
};
Portal.defaultProps = {
	id: 'portal-root',
};

export default Portal;
