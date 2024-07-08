import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import Input from './Input';
import ErrorMessage from './ErrorMessage';
import Icon from '../icon/Icon';
import UploadFile from './UploadFile';
import Label from './Label';
import Textarea from './Textarea';
import Button from '../ui/Button';

interface Field {
	name: string;
	label: string;
	type: any;
	options?: any[];
	className?: string;
	wrapperClassName?: string;
	validation?: any;
	labelClassName?: string;
	require?: boolean;
}

interface DynamicFormProps {
	fields: Field[];
	parentClassName?: string;
	commonLabelClassName?: string;
	btnLabel: string; 
	onSubmit: (values: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
	fields,
	parentClassName,
	commonLabelClassName,
	btnLabel,
	onSubmit,
}) => {
	const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

	const togglePasswordVisibility = (fieldName: string) => {
		setShowPassword((prevState) => ({
			...prevState,
			[fieldName]: !prevState[fieldName],
		}));
	};

	const formik = useFormik({
		initialValues: fields.reduce(
			(acc, field) => {
				acc[field.name] = field.type === 'checkbox' ? false : '';
				return acc;
			},
			{} as Record<string, any>,
		),
		validationSchema: Yup.object().shape(
			fields.reduce(
				(acc, field) => {
					if (field.validation) {
						acc[field.name] = field.validation;
					}
					return acc;
				},
				{} as Record<string, any>,
			),
		),
		onSubmit: async (values, { resetForm }) => {
			await onSubmit(values);
			resetForm();
		},
	});

	const renderField = (field: Field) => {
		const { name, label, type, options, className, wrapperClassName, ...rest } = field;
		const inputType = type === 'password' && showPassword[name] ? 'text' : type;

		switch (type) {
			case 'select':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							require={field.require || false}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<Select
							id={name}
							name={name}
							className={className}
							value={options?.find(
								(option: any) => option.value === formik.values[name],
							)}
							onChange={(option) => formik.setFieldValue(name, option?.value)}
							onBlur={formik.handleBlur}
							options={options}
							{...rest}
						/>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={name}
						/>
					</div>
				);
			case 'checkbox':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<label className='flex items-center'>
							<input
								type='checkbox'
								name={name}
								className={className}
								checked={formik.values[name]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								{...rest}
							/>
							<span className='ml-2'>{label}</span>
						</label>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={name}
						/>
					</div>
				);
			case 'radio':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							require={field.require || false}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						{options?.map((option: any) => (
							<label key={option.value} className='flex items-center'>
								<input
									type='radio'
									name={name}
									value={option.value}
									className={className}
									checked={formik.values[name] === option.value}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									{...rest}
								/>
								<span className='ml-2'>{option.label}</span>
							</label>
						))}
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={name}
						/>
					</div>
				);
			case 'password':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							require={field.require || false}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<div className='relative'>
							<Input
								id={name}
								name={name}
								type={inputType}
								className={className}
								value={formik.values[name]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								{...rest}
							/>
							<Icon
								className='absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer'
								icon={showPassword[name] ? 'HeroEyeSlash' : 'HeroEye'}
								onClick={() => togglePasswordVisibility(name)}
							/>
						</div>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={name}
						/>
					</div>
				);
			case 'file':
				return (
					<div className={` ${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							require={field.require || false}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<UploadFile
							handleFileChange={(e) => formik.setFieldValue(name, e.target.files)}
							value={formik.values[name]}
							handleRemoveFile={() => formik.setFieldValue(name, '')}
						/>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={name}
						/>
					</div>
				);
			case 'textarea':
				return (
					<div className={` ${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							require={field.require || false}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<Textarea
							id={name}
							name={name}
							className={className}
							value={formik.values[name]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							{...rest}
						/>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={name}
						/>
					</div>
				);
			default:
				return (
					<div className={` ${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							require={field.require || false}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<Input
							id={name}
							name={name}
							type={type}
							className={className}
							value={formik.values[name]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							{...rest}
						/>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={name}
						/>
					</div>
				);
		}
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<div className={`${parentClassName}`}>{fields.map((field) => renderField(field))}</div>
			<div className='mt-2 flex gap-2'>
				<Button
					variant='solid'
					color='blue'
					isLoading={formik.isSubmitting}
					isDisable={formik.isSubmitting}
					type='submit'>
					{btnLabel}
				</Button>
			</div>
		</form>
	);
};

export default DynamicForm;
