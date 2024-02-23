import React, { useState } from 'react';

import { useFormik } from 'formik';
import classNames from 'classnames';
import { Link, Navigate, redirect, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import Button from '../components/ui/Button';
import { useAuth } from '../context/authContext';
import Input from '../components/form/Input';
import LogoTemplate from '../templates/layouts/Logo/Logo.template';
import FieldWrap from '../components/form/FieldWrap';
import Icon from '../components/icon/Icon';
import Validation from '../components/form/Validation';
import SignupPage from './Signup.page';
import firestore, { auth } from '../firebase';
import Alert from '../components/ui/Alert';

type TValues = {
	username: string;
	password: string;
	// role: string;
};

const LoginPage = () => {
	const navigate = useNavigate();

	const { onLogin } = useAuth();
	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();
	const [exModal1, setExModal1] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
		},
		validate: (values: TValues) => {
			// console.log('value', values);
			const errors: Partial<TValues> = {};

			if (!values.username) {
				errors.username = 'Email Required';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
				errors.username = 'Invalid email address';
			}

			if (!values.password) {
				errors.password = 'Password Required';
			} else if (values.password.length < 6) {
				errors.password = 'Password must be at least 6 characters long';
			}

			return errors;
		},
		onSubmit: (values: TValues, { setFieldError }) => {
			setError(undefined);
			onLogin(values.username, values.password)
				.then((res) => {
					console.log('then called', res);
				})
				.catch((e: Error) => {
					console.log('e', e.message);
					setError(e.message);
					if (e.cause === 'username') {
						setFieldError('username', e.message);
						setFieldError('password', e.message);
					}
					if (e.cause === 'password') setFieldError('password', e.message);
				});
		},
	});
	const handleReset = () => {
		navigate('/reset');
	};

	React.useEffect(() => {
		// Use the effect to trigger the toast when there is an error
		if (error) {
			toast.error('Invalid Login Credential.');
		}
	}, [error]);

	return (
		<PageWrapper isProtectedRoute={false} className='bg-white dark:bg-inherit' name='Sign In'>
			<div className='w-lg-full  flex  h-full  items-center justify-center'>
				<div className='flex w-1/4 flex-col justify-center gap-8'>
					<div>
						<LogoTemplate className='h-14' />
					</div>
					<div>
						<span className='text-4xl font-semibold'>Sign in</span>
					</div>
					<div className='border border-zinc-500/25 dark:border-zinc-500/50' />
					<div>
						<span>Log in to continue</span>
					</div>
					<form className='flex flex-col gap-4' noValidate>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.username}
								invalidFeedback={formik.errors.username}
								validFeedback='Good'>
								<FieldWrap
									firstSuffix={<Icon icon='HeroEnvelope' className='mx-2' />}>
									<Input
										className='px-8'
										dimension='lg'
										id='username'
										autoComplete='username'
										name='username'
										placeholder='Email or username'
										value={formik.values.username}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.password}
								invalidFeedback={formik.errors.password}
								// validFeedback='Good'
							>
								<FieldWrap
									firstSuffix={<Icon icon='HeroKey' className='mx-2' />}
									lastSuffix={
										<Icon
											className='mx-2 cursor-pointer'
											icon={passwordShowStatus ? 'HeroEyeSlash' : 'HeroEye'}
											onClick={() => {
												setPasswordShowStatus(!passwordShowStatus);
											}}
										/>
									}>
									<Input
										className='px-8'
										dimension='lg'
										type={passwordShowStatus ? 'text' : 'password'}
										autoComplete='current-password'
										id='password'
										name='password'
										placeholder='Password'
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>

						<div>
							<Button
								size='lg'
								variant='solid'
								className='w-full font-semibold'
								onClick={() => formik.handleSubmit()}>
								Sign in
							</Button>
						</div>

						<div>
							<span className='flex cursor-pointer text-sm'>
								<span
									className='text-zinc-400 dark:text-zinc-600'
									onClick={handleReset}>
									Forgot Password
								</span>
							</span>
						</div>
					</form>
				</div>
			</div>
		</PageWrapper>
	);
};

export default LoginPage;
