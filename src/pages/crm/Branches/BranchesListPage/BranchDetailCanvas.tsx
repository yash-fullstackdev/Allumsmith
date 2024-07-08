import { Input, Label, Textarea } from "../../../../components/form";


const BranchDetailCanvas = ({ branchDetails }: any) => {
	return (
		<div className='gap-4 grid mt-2'>
			<div className='flex items-center'>
				<Label htmlFor='branchName' className='w-1/3'>
					Branch Name
				</Label>
				<Input
					id='branchName'
					name='branchName'
					value={branchDetails.name}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='phone' className='w-1/3'>
					Phone
				</Label>
				<Input
					id='phone'
					name='phone'
					value={branchDetails.phone}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='contactName' className='w-1/3'>
					Contact Person Name
				</Label>
				<Input
					id='contactName'
					name='contactName'
					value={branchDetails.contact_name}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='contactPhone' className='w-1/3'>
					Contact Person Phone
				</Label>
				<Input
					id='contactPhone'
					name='contactPhone'
					value={branchDetails.contact_phone}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='addressLine1' className='w-1/3'>
					Address Line1
				</Label>
				<Textarea
					id='addressLine1'
					name='addressLine1'
					value={branchDetails.address_line1}
					disabled
					className='w-2/3 h-16'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='addressLine2' className='w-1/3'>
					Address Line2
				</Label>
				<Textarea
					id='addressLine2'
					name='addressLine2'
					value={branchDetails.address_line2}
					disabled
					className='w-2/3 h-16'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='city' className='w-1/3'>
					City
				</Label>
				<Input
					id='city'
					name='city'
					value={branchDetails.city}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='state' className='w-1/3'>
					State
				</Label>
				<Input
					id='state'
					name='state'
					value={branchDetails.state}
					disabled
					className='w-2/3'
				/>
			</div>
		</div>
	);
};

export default BranchDetailCanvas;
