import * as Yup from 'yup';
import { phoneRegex } from './formValidations';

const VendorsCreateForm = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        validation: Yup.string().required('Name is required'),
        wrapperClassName: 'col-span-12 lg:col-span-4',
        require: true,
    },
    {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        require: true,
        wrapperClassName: 'col-span-12 lg:col-span-4',
        validation: Yup.number()
            .required('Phone is required')
            .test('valid-phone', 'Invalid Phone number', (value) => {
                return phoneRegex.test(value.toString());
            }),
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        wrapperClassName: 'col-span-12 lg:col-span-4',
        validation: Yup.string().email('Invalid email address'),
    },
    {
        name: 'gstNumber',
        label: 'Gst Number',
        type: 'text',
        wrapperClassName: 'col-span-12 lg:col-span-4',
    },
    {
        name: 'company',
        label: 'Company',
        type: 'text',
        wrapperClassName: 'col-span-12 lg:col-span-4',
    },
    {
        name: 'city',
        label: 'City',
        type: 'text',
        wrapperClassName: 'col-span-12 lg:col-span-4',
    },
    {
        name: 'state',
        label: 'state',
        type: 'text',
        wrapperClassName: 'col-span-12 lg:col-span-4',
    },
    {
        name: 'zipcode',
        label: 'Zipcode',
        type: 'text',
        wrapperClassName: 'col-span-12 lg:col-span-4',
    },
    {
        name: 'addressLine1',
        label: 'Address 1',
        type: 'textarea',
        wrapperClassName: 'col-span-12 lg:col-span-6',
        require: true,
        validation: Yup.string().required('AddressLine1 is required'),
    },
    {
        name: 'addressLine2',
        label: 'Address 2',
        type: 'textarea',
        wrapperClassName: 'col-span-12 lg:col-span-6',
    },
];

export {VendorsCreateForm}