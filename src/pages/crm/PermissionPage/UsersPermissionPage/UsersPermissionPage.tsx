import { useNavigate } from 'react-router-dom';
import UserPermissionForm from '../PermissionPage/UserPermissionForm';
import { PathRoutes } from '../../../../utils/routes/enum';
import Button from '../../../../components/ui/Button';
import { Container, PageWrapper, Subheader, SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts';

const UsersPermissionPage = () => {
	const navigation = useNavigate();
	return (
		<PageWrapper name='Users Permission' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigation(`${PathRoutes.users}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<div className='flex h-full flex-wrap content-start'>
					<div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
						<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
							<UserPermissionForm />
						</div>
					</div>
				</div>
			</Container>
		</PageWrapper>
	);
};

export default UsersPermissionPage;
