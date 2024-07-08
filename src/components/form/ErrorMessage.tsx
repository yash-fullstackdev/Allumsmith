const ErrorMessage = ({ touched, errors, fieldName }: any) => {
	return (
		<div>
			{touched?.[fieldName] && errors?.[fieldName] && (
				<div className='text-red-500'>{errors?.[fieldName]}</div>
			)}
		</div>
	);
};

export default ErrorMessage;
