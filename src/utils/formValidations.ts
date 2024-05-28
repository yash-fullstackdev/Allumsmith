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
			
        })
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
    email: Yup.string().required('email is required'),
    phone: Yup.number().required('Phone is required'),
    company: Yup.string().required('Company Name is required'),
    address_line1: Yup.string().required('Address is required'),
    address_line2: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
	state: Yup.string().required('State is required'),
	zipcode: Yup.number().required('Zipcode is required'),
	pancard: Yup.string().required('PanCard is required'),
});

const vendorSchema =Yup.object().shape({
	name: Yup.string().required('Name is required'),
	email: Yup.string().email('Invalid email address').required('Email is required'),
	
});

const branchSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	address_line1: Yup.string().required('Address Line 1 is required'),
	city: Yup.string().required('City is required'),
	state: Yup.string().required('State is required'),
	zipcode: Yup.string().required('Zipcode is required'),
	phone: Yup.string().required('Phone is required'),
	contact_name: Yup.string().required('Contact Name is required'),
	contact_phone: Yup.string().required('Contact Phone is required'),
	
});

const purchaseOrderSchema = Yup.object().shape({
	vendorName: Yup.string().required('Vendor is required'),
	entries: Yup.array().of(
	  Yup.object().shape({
		product: Yup.string().required('Product is required'),
		requiredQuantity: Yup.number().required('Quantity is required'),
	  })
	),
  });

  const CoatingSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    code: Yup.string()
        .required('Code is required'),
    colors: Yup.array()
		  .min(1, 'At least one color must be selected'),
	type: Yup.string().required('Type of the coating is required')
});

const PaymentSchema = Yup.object().shape({
	payment_mode: Yup.string().required('Payment Mode is required'),
	customer_id:Yup.string().required('Customer Name is Required'),
	amount_payable:Yup.number().required('Payable Amount is Required').positive('Amount Must be greated than 0')


})



export {
	productsSchema,
	editProductSchema,
	wrokersSchema,
	vendorSchema,
	branchSchema,
	purchaseOrderSchema,
	CoatingSchema,
	PaymentSchema
};
