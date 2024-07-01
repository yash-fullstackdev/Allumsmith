import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import { Link } from 'react-router-dom';

const CustomerDetailsCanvas = ({ customerDetails }: any) => {
	return (
		<div className='grid gap-4 mt-2'>
			<div className='flex items-center'>
				<Label htmlFor='customerName' className='w-1/3'>
					Customer Name
				</Label>
				<Input
					id='customerName'
					name='customerName'
					value={customerDetails.name}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='email' className='w-1/3'>
					Email
				</Label>
				<Input
					id='email'
					name='email'
					value={customerDetails.email}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='phone' className='w-1/3'>
					Phone No
				</Label>
				<Input
					id='phone'
					name='phone'
					value={customerDetails.phone}
					disabled
					className='w-2/3'
				/>
			</div>
			{customerDetails.address_line1 && (
				<div className='flex items-center'>
					<Label htmlFor='address_line1' className='w-1/3'>
						Address Line 1
					</Label>
					<Input
						id='address_line1'
						name='address_line1'
						value={customerDetails.address_line1}
						disabled
						className='w-2/3'
					/>
				</div>
			)}
			{customerDetails.address_line2 && (
				<div className='flex items-center'>
					<Label htmlFor='address_line2' className='w-1/3'>
						Address Line 2
					</Label>
					<Input
						id='address_line2'
						name='address_line2'
						value={customerDetails.address_line2}
						disabled
						className='w-2/3'
					/>
				</div>
			)}
			{customerDetails.file &&
				customerDetails.file.map((file: any) => (
					<div className='flex flex-col gap-2' key={file?.fileName}>
						<Label htmlFor={file?.fileName} className='font-medium'>
							{file?.fileName.split('-')[1]}
						</Label>
						<Link to={file?.fileUrl} target='_blank' >
							View
						</Link>
					</div>
				))}
		</div>
	);
};

export default CustomerDetailsCanvas;
