import { modulesDbList } from './modules.db';
import { TPermission } from '../../constants/permissions.constant';

export type TState = {
	id: string;
	stateName: string;
	modules: { [key: string]: TPermission };
};

const moduleAccess: TPermission = {
	read: false,
	write: false,
	delete: false,
};

export const defaultEmptyState: TState = {
	id: '',
	stateName: '',
	modules: Object.values(modulesDbList)
		.map((module) => module.id)
		.reduce((obj: TState['modules'], moduleName) => {
			obj[moduleName] = moduleAccess;
			return obj;
		}, {}),
};

export const statesDbList = {
	AL: { id: 'AL', name: 'AL' },
	AK: { id: 'AK', name: 'AK' },
	AZ: { id: 'AZ', name: 'AZ' },
	AR: { id: 'AR', name: 'AR' },
	CA: { id: 'CA', name: 'CA' },
	CO: { id: 'CO', name: 'CO' },
	CT: { id: 'CT', name: 'CT' },
	DE: { id: 'DE', name: 'DE' },
	FL: { id: 'FL', name: 'FL' },
	GA: { id: 'GA', name: 'GA' },
	HI: { id: 'HI', name: 'HI' },
	ID: { id: 'ID', name: 'ID' },
	IL: { id: 'IL', name: 'IL' },
	IN: { id: 'IN', name: 'IN' },
	IA: { id: 'IA', name: 'IA' },
	KS: { id: 'KS', name: 'KS' },
	KY: { id: 'KY', name: 'KY' },
	LA: { id: 'LA', name: 'LA' },
	ME: { id: 'ME', name: 'ME' },
	MD: { id: 'MD', name: 'MD' },
	MA: { id: 'MA', name: 'MA' },
	MI: { id: 'MI', name: 'MI' },
	MN: { id: 'MN', name: 'MN' },
	MS: { id: 'MS', name: 'MS' },
	MO: { id: 'MO', name: 'MO' },
	MT: { id: 'MT', name: 'MT' },
	NE: { id: 'NE', name: 'NE' },
	NV: { id: 'NV', name: 'NV' },
	NH: { id: 'NH', name: 'NH' },
	NJ: { id: 'NJ', name: 'NJ' },
	NM: { id: 'NM', name: 'NM' },
	NY: { id: 'NY', name: 'NY' },
	NC: { id: 'NC', name: 'NC' },
	ND: { id: 'ND', name: 'ND' },
	OH: { id: 'OH', name: 'OH' },
	OK: { id: 'OK', name: 'OK' },
	OR: { id: 'OR', name: 'OR' },
	PA: { id: 'PA', name: 'PA' },
	RI: { id: 'RI', name: 'RI' },
	SC: { id: 'SC', name: 'SC' },
	SD: { id: 'SD', name: 'SD' },
	TN: { id: 'TN', name: 'TN' },
	TX: { id: 'TX', name: 'TX' },
	UT: { id: 'UT', name: 'UT' },
	VT: { id: 'VT', name: 'VT' },
	VA: { id: 'VA', name: 'VA' },
	WA: { id: 'WA', name: 'WA' },
	WV: { id: 'WV', name: 'WV' },
	WI: { id: 'WI', name: 'WI' },
	WY: { id: 'WY', name: 'WY' },
	DC: { id: 'DC', name: 'DC' },
	AS: { id: 'AS', name: 'AS' },
	GU: { id: 'GU', name: 'GU' },
	MP: { id: 'MP', name: 'MP' },
	PR: { id: 'PR', name: 'PR' },
	UM: { id: 'UM', name: 'UM' },
	VI: { id: 'VI', name: 'VI' },
	'CA-AB': { id: 'CA-AB', name: 'CA-AB' },
	'CA-BC': { id: 'CA-BC', name: 'CA-BC' },
	'CA-MB': { id: 'CA-MB', name: 'CA-MB' },
	'CA-NB': { id: 'CA-NB', name: 'CA-NB' },
	'CA-NF': { id: 'CA-NF', name: 'CA-NF' },
	'CA-NT': { id: 'CA-NT', name: 'CA-NT' },
	'CA-NS': { id: 'CA-NS', name: 'CA-NS' },
	'CA-NU': { id: 'CA-NU', name: 'CA-NU' },
	'CA-ON': { id: 'CA-ON', name: 'CA-ON' },
	'CA-PE': { id: 'CA-PE', name: 'CA-PE' },
	'CA-PQ': { id: 'CA-PQ', name: 'CA-PQ' },
	'CA-SK': { id: 'CA-SK', name: 'CA-SK' },
	'CA-YT': { id: 'CA-YT', name: 'CA-YT' },
	'AU-ACT': { id: 'AU-ACT', name: 'AU-ACT' },
	'AU-NSW': { id: 'AU-NSW', name: 'AU-NSW' },
	'AU-NT': { id: 'AU-NT', name: 'AU-NT' },
	'AU-QLD': { id: 'AU-QLD', name: 'AU-QLD' },
	'AU-SA': { id: 'AU-SA', name: 'AU-SA' },
	'AU-TAS': { id: 'AU-TAS', name: 'AU-TAS' },
	'AU-VIC': { id: 'AU-VIC', name: 'AU-VIC' },
	'AU-WA': { id: 'AU-WA', name: 'AU-WA' },
	Other: { id: 'Other', name: 'Other' },
};

// export const statesDbList = {
// 	Alabama: {
// 		id: 'Alabama',
// 		name: 'Alabama',
// 	},
// 	Alaska: {
// 		id: 'Alaska',
// 		name: 'Alaska',
// 	},
// 	Arizona: {
// 		id: 'Arizona',
// 		name: 'Arizona',
// 	},
// 	Arkansas: {
// 		id: 'Arkansas',
// 		name: 'Arkansas',
// 	},
// 	California: {
// 		id: 'California',
// 		name: 'California',
// 	},
// 	Colorado: {
// 		id: 'Colorado',
// 		name: 'Colorado',
// 	},
// 	Connecticut: {
// 		id: 'Connecticut',
// 		name: 'Connecticut',
// 	},
// 	Delaware: {
// 		id: 'Delaware',
// 		name: 'Delaware',
// 	},
// 	Florida: {
// 		id: 'Florida',
// 		name: 'Florida',
// 	},
// 	Georgia: {
// 		id: 'Georgia',
// 		name: 'Georgia',
// 	},
// 	Hawaii: {
// 		id: 'Hawaii',
// 		name: 'Hawaii',
// 	},
// 	Idaho: {
// 		id: 'Idaho',
// 		name: 'Idaho',
// 	},
// 	Illinois: {
// 		id: 'Illinois',
// 		name: 'Illinois',
// 	},
// 	Indiana: {
// 		id: 'Indiana',
// 		name: 'Indiana',
// 	},
// 	Iowa: {
// 		id: 'Iowa',
// 		name: 'Iowa',
// 	},
// 	Kansas: {
// 		id: 'Kansas',
// 		name: 'Kansas',
// 	},
// 	Kentucky: {
// 		id: 'Kentucky',
// 		name: 'Kentucky',
// 	},
// 	Louisiana: {
// 		id: 'Louisiana',
// 		name: 'Louisiana',
// 	},
// 	Maine: {
// 		id: 'Maine',
// 		name: 'Maine',
// 	},
// 	Maryland: {
// 		id: 'Maryland',
// 		name: 'Maryland',
// 	},
// 	Massachusetts: {
// 		id: 'Massachusetts',
// 		name: 'Massachusetts',
// 	},
// 	Michigan: {
// 		id: 'Michigan',
// 		name: 'Michigan',
// 	},
// 	Minnesota: {
// 		id: 'Minnesota',
// 		name: 'Minnesota',
// 	},
// 	Mississippi: {
// 		id: 'Mississippi',
// 		name: 'Mississippi',
// 	},
// 	Missouri: {
// 		id: 'Missouri',
// 		name: 'Missouri',
// 	},
// 	Montana: {
// 		id: 'Montana',
// 		name: 'Montana',
// 	},
// 	Nebraska: {
// 		id: 'Nebraska',
// 		name: 'Nebraska',
// 	},
// 	Nevada: {
// 		id: 'Nevada',
// 		name: 'Nevada',
// 	},
// 	'New Hampshire': {
// 		id: 'New Hampshire',
// 		name: 'New Hampshire',
// 	},
// 	'New Jersey': {
// 		id: 'New Jersey',
// 		name: 'New Jersey',
// 	},
// 	'New Mexico': {
// 		id: 'New Mexico',
// 		name: 'New Mexico',
// 	},
// 	'New York': {
// 		id: 'New York',
// 		name: 'New York',
// 	},
// 	'North Carolina': {
// 		id: 'North Carolina',
// 		name: 'North Carolina',
// 	},
// 	'North Dakota': {
// 		id: 'North Dakota',
// 		name: 'North Dakota',
// 	},
// 	Ohio: {
// 		id: 'Ohio',
// 		name: 'Ohio',
// 	},
// 	Oklahoma: {
// 		id: 'Oklahoma',
// 		name: 'Oklahoma',
// 	},
// 	Oregon: {
// 		id: 'Oregon',
// 		name: 'Oregon',
// 	},
// 	Pennsylvania: {
// 		id: 'Pennsylvania',
// 		name: 'Pennsylvania',
// 	},
// 	'Rhode Island': {
// 		id: 'Rhode Island',
// 		name: 'Rhode Island',
// 	},
// 	'South Carolina': {
// 		id: 'South Carolina',
// 		name: 'South Carolina',
// 	},
// 	'South Dakota': {
// 		id: 'South Dakota',
// 		name: 'South Dakota',
// 	},
// 	Tennessee: {
// 		id: 'Tennessee',
// 		name: 'Tennessee',
// 	},
// 	Texas: {
// 		id: 'Texas',
// 		name: 'Texas',
// 	},
// 	Utah: {
// 		id: 'Utah',
// 		name: 'Utah',
// 	},
// 	Vermont: {
// 		id: 'Vermont',
// 		name: 'Vermont',
// 	},
// 	Virginia: {
// 		id: 'Virginia',
// 		name: 'Virginia',
// 	},
// 	Washington: {
// 		id: 'Washington',
// 		name: 'Washington',
// 	},
// 	'West Virginia': {
// 		id: 'West Virginia',
// 		name: 'West Virginia',
// 	},
// 	Wisconsin: {
// 		id: 'Wisconsin',
// 		name: 'Wisconsin',
// 	},
// 	Wyoming: {
// 		id: 'Wyoming',
// 		name: 'Wyoming',
// 	},
// 	'District of Columbia': {
// 		id: 'District of Columbia',
// 		name: 'District of Columbia',
// 	},
// 	'American Samoa': {
// 		id: 'American Samoa',
// 		name: 'American Samoa',
// 	},
// 	Guam: {
// 		id: 'Guam',
// 		name: 'Guam',
// 	},
// 	'Northern Mariana Islands': {
// 		id: 'Northern Mariana Islands',
// 		name: 'Northern Mariana Islands',
// 	},
// 	'Puerto Rico': {
// 		id: 'Puerto Rico',
// 		name: 'Puerto Rico',
// 	},
// 	'United States Minor Outlying Islands': {
// 		id: 'United States Minor Outlying Islands',
// 		name: 'United States Minor Outlying Islands',
// 	},
// 	'Virgin Islands, U.S.': {
// 		id: 'Virgin Islands, U.S.',
// 		name: 'Virgin Islands, U.S.',
// 	},
// 	Alberta: {
// 		id: 'Alberta',
// 		name: 'Alberta',
// 	},
// 	'British Columbia': {
// 		id: 'British Columbia',
// 		name: 'British Columbia',
// 	},
// 	Manitoba: {
// 		id: 'Manitoba',
// 		name: 'Manitoba',
// 	},
// 	'New Brunswick': {
// 		id: 'New Brunswick',
// 		name: 'New Brunswick',
// 	},
// 	Newfoundland: {
// 		id: 'Newfoundland',
// 		name: 'Newfoundland',
// 	},
// 	'Northwest Territories': {
// 		id: 'Northwest Territories',
// 		name: 'Northwest Territories',
// 	},
// 	'Nova Scotia': {
// 		id: 'Nova Scotia',
// 		name: 'Nova Scotia',
// 	},
// 	Nunavut: {
// 		id: 'Nunavut',
// 		name: 'Nunavut',
// 	},
// 	Ontario: {
// 		id: 'Ontario',
// 		name: 'Ontario',
// 	},
// 	'Prince Edward Island': {
// 		id: 'Prince Edward Island',
// 		name: 'Prince Edward Island',
// 	},
// 	Quebec: {
// 		id: 'Quebec',
// 		name: 'Quebec',
// 	},
// 	Saskatchewan: {
// 		id: 'Saskatchewan',
// 		name: 'Saskatchewan',
// 	},
// 	Yukon: {
// 		id: 'Yukon',
// 		name: 'Yukon',
// 	},
// 	'Australian Capital Territory': {
// 		id: 'Australian Capital Territory',
// 		name: 'Australian Capital Territory',
// 	},
// 	'New South Wales': {
// 		id: 'New South Wales',
// 		name: 'New South Wales',
// 	},
// 	'Northern Territory': {
// 		id: 'Northern Territory',
// 		name: 'Northern Territory',
// 	},
// 	Queensland: {
// 		id: 'Queensland',
// 		name: 'Queensland',
// 	},
// 	'South Australia': {
// 		id: 'South Australia',
// 		name: 'South Australia',
// 	},
// 	Tasmania: {
// 		id: 'Tasmania',
// 		name: 'Tasmania',
// 	},
// 	Victoria: {
// 		id: 'Victoria',
// 		name: 'Victoria',
// 	},
// 	'Western Australia': {
// 		id: 'Western Australia',
// 		name: 'Western Australia',
// 	},
// 	Other: {
// 		id: 'Other',
// 		name: 'Other',
// 	},
// };

const statesDb: any = Object.values(statesDbList);

export default statesDb;
