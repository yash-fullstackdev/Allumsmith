import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import { ToastContainer } from 'react-toastify';
import AsideRouter from '../components/router/AsideRouter';
import Wrapper from '../components/layouts/Wrapper/Wrapper';
import HeaderRouter from '../components/router/HeaderRouter';
import ContentRouter from '../components/router/ContentRouter';
import FooterRouter from '../components/router/FooterRouter';
import useFontSize from '../hooks/useFontSize';
import getOS from '../utils/getOS.util';
import { Router, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	// const navigate = useNavigate();
	// const pathName = useLocation();
	// const [isLoading, setIsLoading] = useState(true)
	getOS();

	const { fontSize } = useFontSize();
	dayjs.extend(localizedFormat);

	// const userLoggedIn = localStorage.getItem('accesstoken');
	// useEffect(() => {
	// 	const checkPath = pathName.pathname.includes("login") || pathName.pathname.includes('signup');
	// 	if (!userLoggedIn && !checkPath) {
	// 		navigate('/login'); // Redirect to login page
	// 		setIsLoading(false)
	// 	} else {
	// 		setIsLoading(false)
	// 	}
	// }, [userLoggedIn]);

	return (
		<>
			<style>{`:root {font-size: ${fontSize}px}`}</style>
			<div data-component-name='App' className='flex grow flex-col'>
				<AsideRouter />
				<Wrapper>
					<ToastContainer />
					<HeaderRouter />
					<ContentRouter />
					<FooterRouter />
				</Wrapper>
			</div>
		</>
	);
};

export default App;
