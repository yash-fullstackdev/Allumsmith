import { SignIn } from '@clerk/clerk-react';
const SignInComponent = () => {
	return (
		<div className='flex h-screen items-center justify-center'>
			<div className='w-96'>
				<SignIn
					path='/sign-in'
					signUpUrl={`${import.meta.env.VITE_LOCAL_SERVER_URL}/sign-up`}
				/>
			</div>
		</div>
	);
};

export default SignInComponent;
