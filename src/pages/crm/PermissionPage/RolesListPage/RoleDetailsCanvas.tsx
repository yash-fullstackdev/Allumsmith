import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Checkbox from '../../../../components/form/Checkbox';

const RoleDetailCanvas = ({ RoleDetails }: any) => {
	return (
		<div className='mt-2 grid gap-4'>
			<div className='flex items-center'>
				<Label htmlFor='roleName' className='w-1/3'>
					Role Name
				</Label>
				<Input
					id='roleName'
					name='roleName'
					value={RoleDetails.name}
					disabled
					className='w-2/3'
				/>
			</div>

			<div className='flex flex-col gap-2'>
				<Label htmlFor='rolePermissions' className='w-1/3'>
					Role Permissions
				</Label>
				{Object.keys(RoleDetails?.permissionCred || {}).map((key, index) =>
					// index !== 0 ? (
						<div key={index} className='mt-3 flex flex-col'>
							<Label htmlFor=''>{key.split('/')[1]}</Label>
							<div className='flex gap-7'>
								{['read', 'write', 'delete'].map((item: string) => (
									<Checkbox
										key={`${key}-${item}`} 
										label={item}
										id={`${key}-${item}`}
										disabled={true}
										checked={RoleDetails?.permissionCred[key][item] || false} 
										className='mr-2 rounded border-gray-800 text-blue-600 focus:ring-blue-500'
									/>
								))}
							</div>
						</div>
					// ) : null,
				)}
			</div>
		</div>
	);
};

export default RoleDetailCanvas;
