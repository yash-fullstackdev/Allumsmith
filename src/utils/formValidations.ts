import * as Yup from 'yup';
const getCharacterValidationError = (str: string) => {
	return `Your password must have at least 1 ${str} character`;
};
const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VehicleRegexFormat = [
	/^[A-Za-z]{2}\s[0-9]{1,2}\s[A-Za-z]{1,2}\s[0-9]{1,4}$/,
	/^[A-Za-z]{2}[0-9]{1,2}[A-Za-z]{1,2}[0-9]{1,4}$/,
	/^[A-Za-z]{2}[-][0-9]{1,2}[-][A-Za-z]{1,2}[-][0-9]{1,4}$/,
	/^[A-Za-z]{2}\s[0-9]{2}\s[0-9]{1,4}$/,
	/^[A-Za-z]{2}[0-9]{2}[0-9]{1,4}$/,
	/^[0-9]{2}\s[A-Za-z]{2}\s[0-9]{1,4}\s[A-Za-z]{1,2}$/,
	/^[0-9]{2}[A-Za-z]{2}[0-9]{1,4}[A-Za-z]{1,2}$/,
];

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
			hsn: Yup.string().required('HSN is required'),
			productCode: Yup.string().required('Product Code is required'),
			thickness: Yup.string().required('Thickness is required'),
			length: Yup.string().required('Length is required'),
			weight: Yup.string().required('Weight is required'),
		}),
	),
});

const editProductSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	hsn: Yup.string().required('HSN is required'),
	productCode: Yup.string().required('Product Code is required'),
	thickness: Yup.number().required('Thickness is required'),
	length: Yup.number().required('Length is required'),
	weight: Yup.number().required('Weight is required'),
});

const wrokersSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	email: Yup.string().optional(),
	phone: Yup.number().required('Phone is required'),
	company: Yup.string().optional(),
	address_line1: Yup.string().required('Address Line 1 is required'),
	address_line2: Yup.string().optional(),
	city: Yup.string().optional(),
	state: Yup.string().optional(),
	zipcode: Yup.number().optional(),
	pancard: Yup.string().optional(),
});

const vendorSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),

	phone: Yup.number().required('Phone is required')
		.test('valid-phone', 'Invalid Phone number', (value) => {
			return phoneRegex.test(value.toString());
		}),
	email: Yup.string().email('Invalid email address'),
	addressLine1: Yup.string().nullable(),
	addressLine2: Yup.string().nullable(),
}).test({
	test(value) {
		const { addressLine1, addressLine2 } = value;
		if (!addressLine1 && !addressLine2) {
			throw this.createError({
				message: 'At least one of address is required',
				path: 'addressLine1',
			});
		}
		return true;
	},
});
const CustomerSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),

	phone: Yup.number().required('Phone is required')
		.test('valid-phone', 'Invalid Phone number', (value) => {
			return phoneRegex.test(value.toString());
		}),
	email: Yup.string().email('Invalid email address'),
	address_line1: Yup.string().nullable(),
	address_line2: Yup.string().nullable(),
}).test({
	test(value) {
		const { address_line1, address_line2 } = value;
		if (!address_line1 && !address_line2) {
			throw this.createError({
				message: 'At least one of address is required',
				path: 'address_line1',
			});
		}
		return true;
	},
});

const userCreateSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email address').required('Email is required'),
	firstName: Yup.string()
		.max(20, 'Must be 20 characters or less')
		.required('First Name is required'),
	lastName: Yup.string()
		.max(20, 'Must be 20 characters or less')
		.required('Last Name is required'),
	password: Yup.string()
		.min(8, 'Password must be at least 8 characters')
		.required('Password is required'),
	phoneNo: Yup.string()
		.matches(/^\d+$/, 'Phone number must only contain digits')
		.min(10, 'Phone number must be at least 10 digits')
		.max(15, 'Phone number cannot be longer than 15 digits')
		.required('Phone number is required'),
	userRole: Yup.mixed().required('userRole is required'),
});
const userEditSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email address').required('Email is required'),
	firstName: Yup.string()
		.max(20, 'Must be 20 characters or less')
		.required('First Name is required'),
	lastName: Yup.string()
		.max(20, 'Must be 20 characters or less')
		.required('Last Name is required'),
	phoneNo: Yup.string()
		.matches(/^\d+$/, 'Phone number must only contain digits')
		.min(10, 'Phone number must be at least 10 digits')
		.max(15, 'Phone number cannot be longer than 15 digits')
		.required('Phone number is required'),
	userRole: Yup.mixed().required('userRole is required'),
});

const roleSchema = Yup.object().shape({
	roleName : Yup.string().required('Role name is required')
})

const branchSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	address_line1: Yup.string().required('Address Line 1 is required'),
	city: Yup.string().required('City is required'),
	state: Yup.string().required('State is required'),
	zipcode: Yup.string().required('Zipcode is required'),
	phone: Yup.string().required('Phone is required')
		.test('valid-phone', 'Invalid Phone number', (value) => {
			return phoneRegex.test(value.toString());
		}),
	contact_name: Yup.string().required('Contact Name is required'),
	contact_phone: Yup.string().required('Contact Phone is required'),
});

const transportSchema = Yup.object().shape({
	dispatch_date: Yup.date()
		.required('Date is required')
		.min(new Date('2015-01-01') as any, 'Date must be after or equal to January 1, 2015')
		.max(new Date('2035-01-01') as any, 'Date must be before or equal to January 1, 2035'),
	vehicle_no: Yup.string()
		.required('Vehicle No is required')
		.test('vehicleNumber', "Invalid Vehicle number.", function (value) {
			return VehicleRegexFormat?.some((pattern) => pattern.test(value));
		}),

	from_branch: Yup.string()
		.required('From Branch is required')
		.test('not-same', 'From and To Branches cannot be the same', function (value) {
			return value !== this?.parent?.to_branch;
		}),
	to_branch: Yup.string()
		.required('To Branch is required')
		.test('not-same', 'From and To Branches cannot be the same', function (value) {
			return value !== this?.parent?.from_branch;
		}),
	batch: Yup.array().of(
		Yup.object().shape({
			cp_id: Yup.string(),
			products: Yup.array().of(
				Yup.object().shape({
					pickQuantity: Yup.string()
						.test('not-same', 'Please Pick QTY less then or equal to Available QTY', function (value) {
							return !value || Number(value) <= this.parent?.itemSummary?.coatingQuantity;
						})
						.when('itemSummary', {
							is: (val: any) => {
								return Boolean(val);
							},
							then: (schema) => schema.required('Pick Quantity is required'),
							otherwise: (schema) => schema.notRequired(),
						})
						.notRequired(),
				})
			),
		})
	),
	self_products: Yup.array().of(
		Yup.object().shape({
			pickQuantity: Yup.string()
				.test('not-same', 'Please Pick QTY less then or equal to Available QTY', function (value) {
					return !value || Number(value) <= this.parent?.quantity;
				}),
		})
	),
});

const updateTransportStatusSchema = Yup.object().shape({
	status: Yup.string()
		.required('Required is required'),

});

const addCustomerModalSchema = Yup.object()
	.shape({
		name: Yup.string().required('Name is required'),
		email: Yup.string().email('Invalid Email').nullable(),
		phone: Yup.number().required('Phone Number is required'),
		zipcode: Yup.number().nullable(),
		city: Yup.string().required('City is required'),
		state: Yup.string().required('State is required'),
		commercial_discount: Yup.number()
			.positive('Commercial Discount much be positive')
			.nullable(),
		premium_discount: Yup.number().positive('Premium Discount much be positive').nullable(),
		anodize_discount: Yup.number().positive('Anodize Discount much be positive').nullable(),
		address_line1: Yup.string().nullable(),
		address_line2: Yup.string().nullable(),
	})
	.test({
		test(value) {
			const { address_line1, address_line2 } = value;
			if (!address_line1 && !address_line2) {
				throw this.createError({
					message: 'At least one of address is required',
					path: 'address_line1',
				});
			}
			return true;
		},
	});

const purchaseOrderSchema = Yup.object().shape({
	vendor: Yup.string().required('Vendor is required'),
	entries: Yup.array().of(
		Yup.object().shape({
			product: Yup.string().required('Product is required'),
			requiredQuantity: Yup.number().required('Quantity is required'),
		}),
	),
});

const CoatingSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	code: Yup.string().required('Code is required'),
	colors: Yup.array().min(1, 'At least one color must be selected'),
	type: Yup.string().required('Type of the coating is required'),
});

const colorsSchema = Yup.object().shape({
	entries: Yup.array().of(
		Yup.object().shape({
			name: Yup.string().required('Name is required'),
			code: Yup.string().required('Code is required'),
		}),
	),
});

const PaymentSchema = Yup.object().shape({
	payment_mode: Yup.string().required('Payment Mode is required'),
	customer_id: Yup.string().required('Customer Name is Required'),
	amount_payable: Yup.number().required('Payable Amount is Required').positive('Amount Must be greated than 0'),
	todayDate: Yup.string().required('Date is Required'),
})

const AddRawMaterialSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	code: Yup.string().required('Code is Required'),
});

const AddRawMaterialQuantitySchema = Yup.object().shape({
	utility: Yup.string().required('Powder is required'),
	branch: Yup.string().required('Branch is required'),
	quantity: Yup.string().required('Quantity is required'),
})

const jobWithMaterialSchema = Yup.object().shape({

	name: Yup.string()
		.required('Name is required'),

	branch: Yup.string()
		.required('To Branch is required'),
	batch: Yup.array().of(
		Yup.object().shape({
			cp_id: Yup.string(),
			products: Yup.array().of(
				Yup.object().shape({
					pickQuantity: Yup.string()
						.test('not-same', 'Please Pick QTY less then or equal to Pending QTY', function (value) {
							return (
								!value ||
								(this.parent?.itemSummary?.pendingQuantity !== undefined &&
									Number(value) <= this.parent?.itemSummary?.pendingQuantity) ||
								(this.parent?.itemSummary?.pendingQuantity === undefined &&
									this.parent?.quantity &&
									Number(value) <= this.parent?.quantity)
							)
						})
						.test('Positive', 'Please Enter positive number', function (value) {
							return (
								!value || Number(value) >= 0
							)
						})
						.when(['itemSummary', 'quantity'], {
							is: (val: any, val2: any) => {
								console.log('val2 :>> ', val2);
								return Boolean(val?.pendingQuantity);
							},
							then: (schema) => schema.required('Pick Quantity is required'),
							otherwise: (schema) => schema.notRequired(),
						})
						.notRequired(),
				})
			),
		})
	),
	self_products: Yup.array().of(
		Yup.object().shape({
			pickQuantity: Yup.string()
				.test('Positive', 'Please Enter positive number', function (value) {
					return (
						!value || Number(value) >= 0
					)
				})
				.when('value', {
					is: (val: any) => {
						return Boolean(val);
					},
					then: (schema) => schema.required('Pick Quantity is required'),
					otherwise: (schema) => schema.notRequired(),
				})
				.notRequired(),
			coating: Yup.string()
				.when('value', {
					is: (val: any) => {
						return Boolean(val);
					},
					then: (schema) => schema.required('Coating is required'),
					otherwise: (schema) => schema.notRequired(),
				})
				.notRequired(),
			color: Yup.string()
				.when('coating', {
					is: (val: any) => {
						return Boolean(val);
					},
					then: (schema) => schema.required('Color is required'),
					otherwise: (schema) => schema.notRequired(),
				})
				.notRequired(),
		})
	),
});

export {
	productsSchema,
	editProductSchema,
	wrokersSchema,
	vendorSchema,
	branchSchema,
	purchaseOrderSchema,
	CoatingSchema,
	PaymentSchema,
	transportSchema,
	updateTransportStatusSchema,
	userCreateSchema,
	userEditSchema,
	addCustomerModalSchema,
	colorsSchema,
	AddRawMaterialSchema,
	AddRawMaterialQuantitySchema,
	jobWithMaterialSchema,
	CustomerSchema,
	roleSchema
};
