import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import Button from '../ui/Button';
import Label from './Label';
import ErrorMessage from './ErrorMessage';
import UploadFile from './UploadFile';
import Textarea from './Textarea';
import Icon from '../icon/Icon';
import Input from './Input';

interface Field {
	name: string;
	label: string;
	type: string;
	options?: { value: any; label: string }[];
	className?: string;
	wrapperClassName?: string;
	validation?: Yup.StringSchema<string>;
	labelClassName?: string;
	required?: boolean;
}

interface DynamicMultiEntryFormProps {
	fields: any[];
	parentClassName?: string;
	commonLabelClassName?: string;
	btnLabel: string;
	onSubmit: (values: Record<string, any>[]) => void;
}

const DynamicMultiEntryForm: React.FC<DynamicMultiEntryFormProps> = ({
	fields,
	parentClassName,
	commonLabelClassName,
	btnLabel,
	onSubmit,
}) => {
	const [entries, setEntries] = useState<Record<string, any>[]>([{ id: Date.now() }]);

	// Dynamic initialization of initial values based on fields
	const initialValues = fields.reduce(
		(acc, field) => {
			acc[field.name] = field.type === 'checkbox' ? false : '';
			return acc;
		},
		{} as Record<string, any>,
	);

	// Dynamic creation of validation schema based on fields
	const validationSchema = Yup.object().shape({
		entries: Yup.array().of(
			Yup.object().shape(
				fields.reduce(
					(acc, field) => {
						if (field.validation) {
							acc[field.name] = field.validation;
						}
						return acc;
					},
					{} as Record<string, Yup.StringSchema<string>>,
				),
			),
		),
	});

	const formik: any = useFormik({
		initialValues: {
			entries: [initialValues],
		},
		validationSchema,
		onSubmit: (values) => {
			onSubmit(values.entries);
		},
	});

	const handleAddEntry = () => {
		setEntries([...formik.values.entries, initialValues]);
		formik.setFieldValue(`entries`, [...formik.values.entries, initialValues]);
	};

	const handleRemoveEntry = (index: number) => {
		setEntries(entries.filter((_, i) => i !== index));
		formik.setFieldValue(
			'entries',
			formik.values.entries.filter((_: any, i: any) => i !== index),
		);
	};

	const handleChange = (index: number, fieldName: string, value: any) => {
		const newEntries = [...formik.values.entries];
		newEntries[index][fieldName] = value;
		formik.setFieldValue('entries', newEntries);
	};

	const renderField = (field: Field, index: number) => {
		const {
			name,
			label,
			type,
			options,
			className,
			wrapperClassName,
			validation,
			required,
			...rest
		}: any = field;
		const inputType: any = type === 'password' && formik.values.showPassword ? 'text' : type;

		switch (type) {
			case 'select':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<Select
							id={name}
							name={name}
							className={className}
							value={options?.find(
								(option: any) =>
									option.value === formik.values.entries[index][name],
							)}
							onChange={(option: any) => handleChange(index, name, option?.value)}
							onBlur={formik.handleBlur}
							options={options}
							{...rest}
						/>
						<ErrorMessage
							touched={formik.touched.entries?.[index]}
							errors={formik.errors.entries?.[index]}
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
								checked={formik.values.entries[index][name]}
								onChange={(e) => handleChange(index, name, e.target.checked)}
								onBlur={formik.handleBlur}
								{...rest}
							/>
							<span className='ml-2'>{label}</span>
						</label>
						<ErrorMessage
							touched={formik.touched.entries?.[index]}
							errors={formik.errors.entries?.[index]}
							fieldName={name}
						/>
					</div>
				);
			case 'radio':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
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
									checked={formik.values.entries[index][name] === option.value}
									onChange={(e) => handleChange(index, name, e.target.value)}
									onBlur={formik.handleBlur}
									{...rest}
								/>
								<span className='ml-2'>{option.label}</span>
							</label>
						))}
						<ErrorMessage
							touched={formik.touched.entries?.[index]}
							errors={formik.errors.entries?.[index]}
							fieldName={name}
						/>
					</div>
				);
			case 'password':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<div className='relative'>
							<Input
								id={name}
								name={name}
								type={inputType}
								className={className}
								value={formik.values.entries[index][name]}
								onChange={(e) => handleChange(index, name, e.target.value)}
								onBlur={formik.handleBlur}
								{...rest}
							/>
							<Icon
								className='absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer'
								icon={formik.values.showPassword ? 'HeroEyeSlash' : 'HeroEye'}
								onClick={() =>
									formik.setFieldValue(
										'showPassword',
										!formik.values.showPassword,
									)
								}
							/>
						</div>
						<ErrorMessage
							touched={formik.touched.entries?.[index]}
							errors={formik.errors.entries?.[index]}
							fieldName={name}
						/>
					</div>
				);
			case 'file':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<UploadFile
							handleFileChange={(e) => handleChange(index, name, e.target.files)}
							value={formik.values.entries[index][name]}
							handleRemoveFile={() => handleChange(index, name, '')}
						/>
						<ErrorMessage
							touched={formik.touched.entries?.[index]}
							errors={formik.errors.entries?.[index]}
							fieldName={name}
						/>
					</div>
				);
			case 'textarea':
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<Textarea
							id={name}
							name={name}
							className={className}
							value={formik.values.entries[index][name]}
							onChange={(e) => handleChange(index, name, e.target.value)}
							onBlur={formik.handleBlur}
							{...rest}
						/>
						<ErrorMessage
							touched={formik.touched.entries?.[index]}
							errors={formik.errors.entries?.[index]}
							fieldName={name}
						/>
					</div>
				);
			default:
				return (
					<div className={`${wrapperClassName}`} key={name}>
						<Label
							htmlFor={name}
							className={`${field.labelClassName || commonLabelClassName || ''}`}>
							{label}
						</Label>
						<Input
							id={name}
							name={name}
							type={type}
							className={className}
							value={formik.values.entries[index][name]}
							onChange={(e) => handleChange(index, name, e.target.value)}
							onBlur={formik.handleBlur}
							{...rest}
						/>
						<ErrorMessage
							touched={formik.touched.entries?.[index]}
							errors={formik.errors.entries?.[index]}
							fieldName={name}
						/>
					</div>
				);
		}
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			{entries.map((_, index) => (
				<div>
					<div className='mt-2 flex items-end justify-end'>
						{formik?.values?.entries?.length > 1 && (
							<div className='flex items-end justify-end'>
								<Button
									type='button'
									onClick={() => handleRemoveEntry(index)}
									variant='outlined'
									color='red'
									rightIcon={'CrossIcon'}
									style={{ fontSize: 20 }}
								/>
							</div>
						)}
					</div>
					<div key={index} className={parentClassName}>
						{fields.map((field) => renderField(field, index))}
					</div>
				</div>
			))}
			<div className='flex gap-2'>
            <Button type='button' variant="solid" onClick={handleAddEntry} className='mt-4'>
				Add Entry
			</Button>
			<Button type='submit' variant="solid" className='mt-4'>
				{btnLabel}
			</Button>
            </div>
		</form>
	);
};

export default DynamicMultiEntryForm;
