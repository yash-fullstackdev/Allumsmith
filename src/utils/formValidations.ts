import * as Yup from 'yup';

const getCharacterValidationError = (str: string) => {
	return `Your password must have at least 1 ${str} character`;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createUserSchema = Yup.object().shape({
	firstName: Yup.string().min(2, 'Too Short!').required('Required'),
	lastName: Yup.string().min(2, 'Too Short!').required('Required'),
	roleName: Yup.string().min(2, 'Too Short!').required('Required'),
	email: Yup.string()
		.email('Invalid Email')
		.required('Required')
		.test('valid-email', 'Inavlid Email format', (value) => {
			return emailRegex.test(value);
		}),
	password: Yup.string()
		.required('Please enter a Password')
		// check minimum characters
		.min(8, 'Password must have at least 8 characters')
		.max(15, 'Password must not be greater than 15 characters')
		// different error messages for different requirements
		.matches(/[0-9]/, getCharacterValidationError('digit'))
		.matches(/[a-z]/, getCharacterValidationError('lowercase'))
		.matches(/[A-Z]/, getCharacterValidationError('uppercase')),
	// .test('special', 'Password must contain at least one special character', (value) => {
	// 	return /[!@#$%^&*(),.?":{}|<>]/.test(value);
	// }),
});

const customerSchema = Yup.object().shape({
	Name: Yup.string().min(2, 'Too Short!').required('Name is Required'),
	// dbaName: Yup.string()
	// 	.min(2, 'Too Short!')
	// 	.required('DBA Name is Required'),
	address: Yup.string().min(2, 'Too Short!').required('Address is Required'),
	city: Yup.string().min(2, 'Too Short!').required('City is Required'),
	state: Yup.string().min(2, 'Too Short!').required('State is Required'),
	// zipcode: Yup.string().min(5, '!').max(9, '!').required('Zip Code is Required'),
	zipcode: Yup.string()
		.matches(/^\d{5}(-\d{4})?$/, 'Invalid Zip Code')
		.required('Zip Code is Required'),
	country: Yup.string().required('Country is Required'),
	phoneNumber: Yup.string()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number')
		.required('Phone number is Required'),
	phoneNumber2: Yup.string()
		.nullable()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number'),
	fax: Yup.string()
		.nullable()
		.min(14, 'Enter valid Fax number')
		.max(15, 'Enter valid Fax number'),
	URL: Yup.string()
		.nullable()
		.matches(/^(ftp|http|https):\/\/[^ "]+$/, 'Invalid URL. Please enter a valid URL.')
		.min(10, 'URL must be at least 10 characters')
		.max(50, 'URL must not exceed 15 characters'),
	billZipcode: Yup.string()
		.matches(/^\d{5}(-\d{4})?$/, 'Invalid Zip Code')
		.nullable(),
	billPhoneNumber: Yup.string()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number')
		.nullable(),
	billPhoneNumber2: Yup.string()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number')
		.nullable(),
	billFax: Yup.string()
		.nullable()
		.min(14, 'Enter valid Fax number')
		.max(15, 'Enter valid Fax number')
		.nullable(),
	billEmail: Yup.string()
		.nullable()
		.test('validate-emails', 'Inavlid Email format', (value) => {
			const emails = value?.split(',').map((email) => email.trim());
			const isValid = Yup.array()
				.of(
					Yup.string()
						.email('Inavlid Email format')
						.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
				)
				.isValidSync(emails);

			return isValid;
		}),
	invoiceEmail: Yup.string()
		.required('Invoice Email is Required')
		.test('validate-emails', 'Inavlid Email format', (value) => {
			const emails = value?.split(',').map((email) => email.trim());
			const isValid = Yup.array().of(Yup.string().email()).isValidSync(emails);

			return isValid;
		}),
	orderConfirmationEmail: Yup.string()
		.nullable()
		.test('validate-emails', 'Inavlid Email format', (value) => {
			if (!value || value.trim() === '') {
				return true;
			}
			const emails = value?.split(',').map((email) => email.trim());
			return emails?.every((email) => emailRegex.test(email));
		}),
	statementsEmail: Yup.string()
		.nullable()
		.test('validate-emails', 'Inavlid Email format', (value) => {
			if (!value || value.trim() === '') {
				return true;
			}
			const emails = value?.split(',').map((email) => email.trim());
			return emails?.every((email) => emailRegex.test(email));
		}),

	email: Yup.string()
		.required('Email is required')
		.test('validate-emails', 'Inavlid Email format', (value) => {
			const emails = value.split(',').map((email) => email.trim());
			return emails.every((email) => emailRegex.test(email));
		}),
	APcontact: Yup.string().required('A/P Contact is Required'),
	APphoneNumber: Yup.string()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number')
		.required('A/P Phone Number is Required'),
	APemail: Yup.string()
		.required('A/P Email is Required')
		.test('validate-emails', 'Inavlid Email format', (value) => {
			const emails = value?.split(',').map((email) => email.trim());
			return emails?.every((email) => emailRegex.test(email));
		}),

	terms: Yup.string().required('Terms is Required'),
	pricingTerms: Yup.string().required('Pricing Terms is Required'),
	creditLimit: Yup.number().required('Credit Limit is Required'),
	creditHold: Yup.string().required('Credit Hold Required'),
	acceptBO: Yup.string().required('Accept BO is Required'),
	acceptPartialOrder: Yup.string().required('Accept Partial Order is Required'),
	custClass: Yup.string().required('Customer Class is Required'),
	custType: Yup.string().required('Customer Type is Required'),
	// custGroup: Yup.string().required('Customer Group is Required'),
	custPORequired: Yup.string().required('Customer PO is Required'),
	// masterContact: Yup.string().required('Master Contact is Required'),
	masterContactEmail: Yup.string()
		.nullable()
		.test('validate-emails', 'Inavlid Email format', (value) => {
			if (!value || value.trim() === '') {
				return true;
			}
			const emails = value?.split(',').map((email) => email.trim());
			return emails?.every((email) => emailRegex.test(email));
		}),
	buyers: Yup.array().of(
		Yup.object().shape({
			buyerEmail: Yup.string()
				.nullable()
				.test('validate-emails', 'Inavlid Email format', (value) => {
					const emails = value?.split(',').map((email) => email.trim());
					const isValid = Yup.array()
						.of(
							Yup.string()
								.email('Inavlid Email format')
								.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
						)
						.isValidSync(emails);

					return isValid;
				}),
			buyerPhone: Yup.string()
				.nullable()
				.min(14, 'Enter valid Contact')
				.max(15, 'Enter valid Contact'),
		}),
	),
	additionalContactInfo: Yup.array().of(
		Yup.object().shape({
			additionalEmail: Yup.string()
				.nullable()
				.test('validate-emails', 'Inavlid Email format', (value) => {
					const emails = value?.split(',').map((email) => email.trim());
					const isValid = Yup.array()
						.of(
							Yup.string()
								.email('Inavlid Email format')
								.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
						)
						.isValidSync(emails);

					return isValid;
				}),
			additionalPhone: Yup.string()
				.nullable()
				.min(14, 'Enter valid Phone number')
				.max(15, 'Enter valid Phone number'),
			additionalMobile: Yup.string()
				.nullable()
				.min(14, 'Enter valid Mobile number')
				.max(15, 'Enter valid Mobile number'),
			additionalFax: Yup.string()
				.nullable()
				.min(14, 'Enter valid Fax number')
				.max(15, 'Enter valid Fax number'),
		}),
	),
	contacts: Yup.array().of(
		Yup.object().shape({
			SCshippingLocation: Yup.string().required('Shipping Location is Required'),
			// SClocationContactPerson: Yup.string().required('Contact Person is Required'),
			SCcontactAddress1: Yup.string().required('Address is Required'),
			SCcity: Yup.string().required('City is Required'),
			SCstate: Yup.string().required('State is Required'),
			SCzipcode: Yup.string()
				.matches(/^\d{5}(-\d{4})?$/, 'Invalid Zip Code')
				.required('Zip Code is Required'),
			SCcountry: Yup.string().required('Country is Required'),
			SCressComm: Yup.string().required('Res / Comm Address is Required'),
			// SCshipMethod: Yup.string().required('Shipping Method is Required'),
			SCemail: Yup.string().test('validate-emails', 'Inavlid Email format', (value) => {
				if (!value || value.trim() === '') {
					return true;
				}
				const emails = value?.split(',').map((email) => email.trim());
				return emails?.every((email) => emailRegex.test(email));
			}),
			SCphone: Yup.string()
				.min(14, 'Enter valid Phone number')
				.max(15, 'Enter valid Phone number')
				.nullable(),
		}),
	),
});

const vendorSchema = Yup.object().shape({
	vendorStatus: Yup.string().required('Status is Required'),
	Name: Yup.string().required('Name is Required'),
	dbaName: Yup.string().nullable(),
	address: Yup.string().required('Address is Required'),
	city: Yup.string().required('City is Required'),
	state: Yup.string().required('State is Required'),
	// zipcode: Yup.string().min(5, '!').max(9, '!').required('Zip Code is Required'),
	zipcode: Yup.string()
		.matches(/^\d{5}(-\d{4})?$/, 'Invalid Zip Code')
		.required('Zip code is Required'),
	country: Yup.string().required('Country is Required'),

	phoneNumber: Yup.string()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number')
		.required('Phone Number is Required'),
	phoneNumber2: Yup.string()
		.nullable()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number'),
	fax: Yup.string()
		.nullable()
		.min(14, 'Enter valid Fax number')
		.max(15, 'Enter valid Fax number'),

	URL: Yup.string()
		.nullable()
		.matches(/^(ftp|http|https):\/\/[^ "]+$/, 'Invalid URL. Please enter a valid URL.')
		.min(10, 'URL must be at least 10 characters')
		.max(50, 'URL must not exceed 15 characters'),
	email: Yup.string()
		.nullable()
		.test('validate-emails', 'Inavlid Email format', (value) => {
			const emails = value?.split(',').map((email) => email.trim());
			const isValid = Yup.array()
				.of(
					Yup.string()
						.email('Inavlid Email format')
						.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
				)
				.isValidSync(emails);

			return isValid;
		}),
	pophoneNumber: Yup.string()
		.min(14, 'Enter valid Phone number')
		.max(15, 'Enter valid Phone number')
		.nullable(),
	masterContact: Yup.string().nullable(),
	masterContactEmail: Yup.string()
		.nullable()
		.test('validate-emails', 'Inavlid Email format', (value) => {
			const emails = value?.split(',').map((email) => email.trim());
			const isValid = Yup.array()
				.of(
					Yup.string()
						.email('Inavlid Email format')
						.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
				)
				.isValidSync(emails);

			return isValid;
		}),

	POEmail: Yup.string()
		.nullable()
		.test('validate-emails', 'Inavlid Email format', (value) => {
			const emails = value?.split(',').map((email) => email.trim());
			const isValid = Yup.array()
				.of(
					Yup.string()
						.email('Inavlid Email format')
						.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
				)
				.isValidSync(emails);

			return isValid;
		}),
	ARContacts: Yup.array().of(
		Yup.object().shape({
			ARemail: Yup.string()
				.nullable()
				.test('validate-emails', 'Inavlid Email format', (value) => {
					const emails = value?.split(',').map((email) => email.trim());
					const isValid = Yup.array()
						.of(
							Yup.string()
								.email('Inavlid Email format')
								.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
						)
						.isValidSync(emails);

					return isValid;
				}),

			ARphoneNumber: Yup.string()
				.nullable()
				.min(14, 'Enter valid Phone number')
				.max(15, 'Enter valid Phone number'),
			paymentEmail: Yup.string()
				.nullable()
				.test('validate-emails', 'Inavlid Email format', (value) => {
					const emails = value?.split(',').map((email) => email.trim());
					const isValid = Yup.array()
						.of(
							Yup.string()
								.email('Inavlid Email format')
								.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
						)
						.isValidSync(emails);

					return isValid;
				}),
		}),
	),
	salesRep: Yup.array().of(
		Yup.object().shape({
			salesRepEmail: Yup.string()
				.nullable()
				.test('validate-emails', 'Inavlid Email format', (value) => {
					const emails = value?.split(',').map((email) => email.trim());
					const isValid = Yup.array()
						.of(
							Yup.string()
								.email('Inavlid Email format')
								.matches(/^[^@]+@[^.]+\.[a-z]+$/i, 'Inavlid Email format after @'),
						)
						.isValidSync(emails);

					return isValid;
				}),

			salesRepPhone: Yup.string()
				.nullable()
				.min(14, 'Enter valid Phone number')
				.max(15, 'Enter valid Phone number'),
		}),
	),
	terms: Yup.string().nullable(),
	pricingTerms: Yup.string().nullable(),
	// creditLimit: Yup.string(),
	custPORequired: Yup.string(),
});

const rawMaterialDataSchema = Yup.object().shape({
	componentID: Yup.string().required('Component ID is Required'),
	description1: Yup.string().required('Description is Required'),
	sterileNonSterile: Yup.string().required('Sterile/Non Sterile is Required'),
	status: Yup.string().required('Status is Required'),
});

const inHouseComponentDataSchema = Yup.object().shape({
	componentID: Yup.string().required('Component ID is Required'),
	description1: Yup.string().required('Description is Required'),
	status: Yup.string().required('Status is Required'),
	sterileNonSterile: Yup.string().required('Sterile/Non Sterile is Required'),
	inHouseComponentType: Yup.string().required('Component Type is Required'),
});

const vendorModalDataSchema = Yup.object().shape({
	vendorName: Yup.string().required('Vendor Name is Required'),
	procurementUOM: Yup.array().of(
		Yup.object().shape({
			uom: Yup.string().required('Procurement UOM is Required'),
			quantity: Yup.string().required('Procurement Quantity is Required'),
		}),
	),
	pricingUOM: Yup.string().required('Pricing UOM is Required'),
	pricingCost: Yup.string().required('Pricing Cost is Required'),
	pricingQuantity: Yup.string().required('Pricing Quantity is Required'),
});

const shippingDetailsSchema = Yup.object().shape({
	SCshippingLocation: Yup.string().required('Shipping Location is Required'),
	SClocationContactPerson: Yup.string().required('Contact Person is Required'),
	SCcontactAddress1: Yup.string().required('Address is Required'),
	SCcity: Yup.string().required('City is Required'),
	SCstate: Yup.string().required('State is Required'),
	SCzipcode: Yup.string()
		.matches(/^\d{5}(-\d{4})?$/, 'Invalid Zip Code')
		.required('Zip Code is Required'),
	SCcountry: Yup.string().required('Country is Required'),
	SCressComm: Yup.string().required('Res / Comm Address is Required'),
	SCshipMethod: Yup.string().required('Shipping Method is Required'),
	SCemail: Yup.string().test('validate-emails', 'Inavlid Email format', (value) => {
		if (!value || value.trim() === '') {
			return true;
		}
		const emails = value?.split(',').map((email) => email.trim());
		return emails?.every((email) => emailRegex.test(email));
	}),
	SCphone: Yup.string()
		.min(14, 'Enter valid Contact')
		.max(15, 'Enter valid Contact')
		.required('Phone is Required'),
});

const updateUserSchema = Yup.object().shape({
	firstName: Yup.string().min(2, 'Too Short!').required('Required'),
	lastName: Yup.string().min(2, 'Too Short!').required('Required'),
	roleName: Yup.string().min(2, 'Too Short!').required('Required'),
	email: Yup.string().email('Invalid Email address').required('Required'),
});

const conversionComponentSchema = Yup.object().shape({
	componentID: Yup.string().required('Component ID is Required'),
	description1: Yup.string().required('Description is Required'),
	sterileNonSterile: Yup.string().required('Sterile/Non Sterile is Required'),
	status: Yup.string().required('Status is Required'),
	originalComponent: Yup.string().required('Original Component is Required'),
	originalComponentQuantity: Yup.string().required('Original Quantity is Required'),
	convertedQuantity: Yup.string().required('Converted Quantity is Required'),
});
const productsSchema = Yup.object().shape({
    entries: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Name is required'),
            hsn: Yup.string(),
            rate: Yup.string(),
            productCode: Yup.string(),
            thickness: Yup.string(),
            length: Yup.string(),
            weight: Yup.string(),
        })
    ),
});

const editProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    hsn: Yup.string().required('HSN is required'),
    rate: Yup.number().required('Rate is required').positive('Rate must be a positive number'),
    productCode: Yup.string().required('Product Code is required'),
    thickness: Yup.number().required('Thickness is required').positive('Thickness must be a positive number'),
    length: Yup.number().required('Length is required').positive('Length must be a positive number'),
    weight: Yup.number().required('Weight is required').positive('Weight must be a positive number')
});

export {
	productsSchema,
	editProductSchema
};
