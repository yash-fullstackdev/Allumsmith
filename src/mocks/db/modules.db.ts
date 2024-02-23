export type TModule = {
	id: string;
	name: string;
};

export const modulesDbList = {
	product: { id: 'users', name: 'Users' },
	customer: { id: 'customers', name: 'Customers' },
	category: { id: 'mastersetting', name: 'Master Settings' },
	vendors: {id:'vendors', name:'Vendors'},
	components:{id:'components', name:'Components'},
};

const modulesDb: TModule[] = Object.values(modulesDbList);

export default modulesDb;
