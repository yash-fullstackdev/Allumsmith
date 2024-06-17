import { SignUp } from '@clerk/clerk-react';
import LogoTemplate from '../../../../templates/layouts/Logo/Logo.template';

const SignUpComponent = () => {
	return (
		<div className='flex h-screen'>
			<div className='hidden w-[60%] items-center justify-center bg-slate-500 lg:flex'>
				<LogoTemplate className='h-[180px] w-[180px]' />
				<span className='text-[80px] font-normal leading-4'>Allumsmith</span>
			</div>
			<div className='flex w-full items-center justify-center bg-white lg:w-[40%]'>
				<div className='w-96'>
					<SignUp
						path='/sign-up'
						signInUrl={`${import.meta.env.VITE_LOCAL_SERVER_URL}/sign-in`}
					/>
				</div>
			</div>
		</div>
	);
};

export default SignUpComponent;
