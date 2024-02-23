export type TPermissionKEY = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type TPermission = {
	// value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
	read: boolean;
	write: boolean;
	delete: boolean;
	desc?: string;
};
type TPermissions = {
	[key in TPermissionKEY]: TPermission;
};

const PERMISSION: TPermissions = {
	0: {
		read: false,
		write: false,
		delete: false,
		desc: 'No permission.',
	},
	1: {
		read: false,
		write: false,
		delete: true,
		desc: 'Only delete permission.',
	},
	2: {
		read: false,
		write: true,
		delete: false,
		desc: 'Only write permission.',
	},
	3: {
		read: false,
		write: true,
		delete: true,
		desc: 'Write and delete permissions.',
	},
	4: {
		read: true,
		write: false,
		delete: false,
		desc: 'Only read permission.',
	},
	5: {
		read: true,
		write: false,
		delete: true,
		desc: 'Read and delete permission.',
	},
	6: {
		read: true,
		write: true,
		delete: false,
		desc: 'Read and write permissions.',
	},
	7: {
		read: true,
		write: true,
		delete: true,
		desc: 'Read, write, and delete permission.',
	},
};
export default PERMISSION;
