import React, { useState } from 'react';

import { useFormik } from 'formik';
import classNames from 'classnames';
import { Link, Navigate, redirect, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
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
import 'react-toastify/dist/ReactToastify.css';

type TValues = {
	email: string;
	// password: string;
	// role: string;
};

const ResetPage = () => {
	const [windowAlert, setWindowAlert] = useState(false);
	const notify = () => toast('Wow so easy!');
	const navigate = useNavigate();

	// const handleSubmit = async (e) => {
	// 	const emailVal = e.target.email.value;
	// 	sendPasswordResetEmail(auth, emailVal)
	// 		.then((data) => {
	// 			alert('Check your email');
	// 		})
	// 		.catch((e) => {
	// 			alert(e.code);
	// 		});
	// };

	const formik = useFormik({
		initialValues: {
			email: '',
			// password: '',
		},
		validate: (values: TValues) => {
			console.log('value', values);
			const errors: Partial<TValues> = {};

			if (!values.email) {
				errors.email = 'Email is Required';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
				errors.email = 'Invalid email address';
			}

			// if (!values.password) {
			// 	errors.password = 'Required';
			// }

			return errors;
		},
		onSubmit: (values: TValues, ) => {
			// sendPasswordResetEmail(auth, values.email)
			// 	.then((data) => {
			// 		// alert('Check your email');
			// 		// setWindowAlert(true);

			// 		navigate('/login');
			// 	})
			// 	.catch((e) => {
			// 		alert(e.code);

			// 	});
			// console.log(values, 'values');
			sendPasswordResetEmail(auth, values.email)
				.then(() => {
					toast.success('Password reset email sent successfully!');
					navigate('/login');
				})
				.catch((error) => {
					toast.error(`Error: ${error.message}`);
				});
		},
	});
	return (
		<PageWrapper isProtectedRoute={false} className='bg-white dark:bg-inherit' name='Reset'>
			{windowAlert && (
				<Alert
					className='border-transparent'
					color='amber'
					icon='HeroBeaker'
					title='Example Alert!'
					variant='solid'>
					You can use props and tailwind's class names as needed for your design.
				</Alert>
			)}
			;
			<div className='w-lg-full flex h-full  w-full flex-col items-center justify-center'>
				<div className='flex w-1/4 flex-col gap-4'>
					<div>
						<LogoTemplate className='mb-4 h-12' />
					</div>
					<div>
						<span className='text-4xl font-semibold'>Reset Password</span>
					</div>
					<div className=' border border-zinc-500/25 dark:border-zinc-500/50' />
					<div className=''>
						<span className=''>Enter email to continue</span>
					</div>
					<Validation
						isValid={formik.isValid}
						isTouched={formik.touched.email}
						invalidFeedback={formik.errors.email}
						validFeedback='Good'>
						<FieldWrap
							className='my-0'
							firstSuffix={<Icon icon='HeroEnvelope' className='mx-2' />}>
							<Input
								className='pl-8'
								dimension='lg'
								// variant='solid'
								id='email'
								autoComplete='email'
								name='email'
								placeholder='Email'
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</FieldWrap>
					</Validation>
					<div className='flex max-w-lg flex-col '>
						<Button
							// type='submit'
							size='lg'
							variant='solid'
							className='w-full font-semibold'
							onClick={() => formik.handleSubmit()}>
							Reset
						</Button>
					</div>
					<div>
						<span className='flex cursor-pointer text-sm'>
							<span
								className='text-zinc-400 dark:text-zinc-600'
								onClick={() => navigate('/login')}>
								Sign In
							</span>
						</span>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
};

export default ResetPage;
