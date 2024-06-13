import { SignUp } from '@clerk/clerk-react';

const SignUpComponent = () => {
	return (
		<div className='flex h-screen items-center justify-center'>
			<div className='w-96'>
				<SignUp
					path='/sign-up'
					signInUrl={`${import.meta.env.VITE_LOCAL_SERVER_URL}/sign-in`}
				/>
			</div>
		</div>
	);
};

export default SignUpComponent;
