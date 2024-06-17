import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import UserPermissionForm from '../PermissionPage/UserPermissionForm';

const UsersPermissionPage = () => {
	return (
		<PageWrapper name='Users Permission' isProtectedRoute={true}>
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
