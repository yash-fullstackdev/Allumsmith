interface RawMaterialsType {
    [key: string]: string[];
}

 export  interface UomOption {
    value: string;
    label: string;
}

export interface MasterSettings {
	customerClass: any[];
	customerType: any[];
	paymentMethod: any[];
	pricingTerms: any[];
	shippingMethod: any[];
	terms: any[];
	orderSource: any[];
	salesmanMaintenance: any[];
}

export type {RawMaterialsType}

