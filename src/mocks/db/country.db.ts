import { modulesDbList } from './modules.db';
import { TPermission } from '../../constants/permissions.constant';
import { TState } from './states.db';

export type TCountry = {
	id: string;
	countryName?:string,
	stateName: string;
	modules: { [key: string]: TPermission };
};

const moduleAccess: TPermission = {
	read: false,
	write: false,
	delete: false,
};

export const defaultEmptyCountry: any  = {
	id: '',
	countryName: '',
	modules: Object.values(modulesDbList)
		.map((module) => module.id)
		.reduce((obj: TState['modules'], moduleName) => {
			obj[moduleName] = moduleAccess;
			return obj;
		}, {}),
};

export const countryDbList = {
	USA: {
		id: 'USA',
		name: 'USA',
	},
	Canada: {
		id: 'Canada',
		name: 'Canada',
	},
	Australia: {
		id: 'Australia',
		name: 'Australia',
	},
	UK: {
		id: 'UK',
		name: 'United Kingdom',
	},
	France: {
		id: 'France',
		name: 'France',
	},
	Germany: {
		id: 'Germany',
		name: 'Germany',
	},
	China: {
		id:'China',
		name: 'China'
	}
};

const countryDb: any = Object.values(countryDbList);

export default countryDb;
