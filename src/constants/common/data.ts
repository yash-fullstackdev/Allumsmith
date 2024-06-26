const admins = ['allumsmith2023@yopmail.com',"yuvrajsinh.borasiya@bitontree.com"];
const userInitialPermission = {
	'/add-branches': true,
	'/add-coating': true,
	'/add-colors': true,
	'/add-cuo-order': true,
	'/add-customer': true,
	'/add-inventory': true,
	'/add-invoice': true,
	'/add-jobs': true,
	'/add-ledger': true,
	'/transport': true,
	'/add-transport': true,
	'/add-payment': true,
	'/add-product': true,
	'/add-purchase-order': true,
	'/add-storage': true,
	'/add-users-permissions': true,
	'/add-vendor': true,
	'/add-worker': true,
	'/branches': true,
	'/coating': true,
	'/colors': true,
	'/cuo-order': true,
	'/customer': true,
	'/edit-branches': true,
	'/edit-coating': true,
	'/edit-colors': true,
	'/edit-cuo-order': true,
	'/edit-customer': true,
	'/edit-invoice': true,
	'/edit-jobs': true,
	'/edit-jobs-withoutmaterial': true,
	'/edit-ledger': true,
	'/edit-product': true,
	'/edit-purchase-order': true,
	'/edit-vendor': true,
	'/edit-worker': true,
	'/finish-storage': true,
	'/inventory': true,
	'/invoice-list': true,
	'/jobs': true,
	'/ledger-list': true,
	'/product': true,
	'/purchase-order': true,
	'/raw-material': true,
	'/users': true,
	'/vendor': true,
	'/worker': true,
};

const permissionCredAll ={
	"/jobs": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/colors": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/vendor": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/worker": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/coating": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/product": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/branches": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/customer": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/cuo-order": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/inventory": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/transport": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/add-payment": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/ledger-list": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/invoice-list": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/raw-material": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/finish-storage": {
		"read": true,
		"write": true,
		"delete": true
	},
	"/purchase-order": {
		"read": true,
		"write": true,
		"delete": true
	}
}



const userPageRoutes = ["/add-users-permissions","/roles","/add-roles"]

const permissionsTypes = ['read', 'write', 'delete'];
export { admins, userInitialPermission, permissionsTypes,permissionCredAll,userPageRoutes };
