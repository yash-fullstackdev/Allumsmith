import { SignIn } from '@clerk/clerk-react';
import LogoTemplate from '../../../../templates/layouts/Logo/Logo.template';

const SignInComponent = () => {
	return (
		<div className='flex min-h-screen'>
			<div className='hidden w-[60%] items-center justify-center bg-slate-500 lg:flex'>
				<LogoTemplate className='h-[180px] w-[180px]' />
				<span className='text-[80px] font-normal leading-4'>Allumsmith</span>
			</div>
			<div className='flex w-full items-center justify-center lg:w-[40%]'>
				<div className='flex h-screen w-96 items-center justify-center '>
					<SignIn
						path='/sign-in'
						signUpUrl={`${import.meta.env.VITE_LOCAL_SERVER_URL}/sign-up`}
					/>
				</div>
			</div>
		</div>
	);
};

export default SignInComponent;
