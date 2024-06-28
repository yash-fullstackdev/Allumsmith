import { permission } from 'process';
import { pagesToCheck } from '../constants/common/data';

const shouldRedirectOrShowLoader = (
	isSignedIn: boolean | undefined,
	isLoading: boolean,
	pathName: any,
): boolean => {
	return (
		!isSignedIn &&
		!isLoading &&
		!pathName.pathname.startsWith('/sign-in') &&
		!pathName.pathname.startsWith('/sign-up')
	);
};

const allReadPermissionsTrueData = (pagesToCheck: any, value: boolean) =>
	pagesToCheck.reduce((result: any, page: any) => {
		result[page] = value;
		return result;
	}, {});

const togglePermissionAndUpdateInnerPages = (
	pageId: any,
	prevPermissions: any,
	appPages: any,
	permission: any,
	writeRemove?: any,
) => {
	let updatedPermissions: any = {
		...prevPermissions,
	};

	switch (permission) {
		case 'read':
			updatedPermissions = {
				...prevPermissions,
				[pageId.to]: !prevPermissions[pageId.to],
			};
			break;

		case 'write':
			if (!writeRemove) {
				const pagesToUpdate = getAllInnerPages(pageId, appPages);
				pagesToUpdate.forEach((page: any) => {
					updatedPermissions = {
						...updatedPermissions,
						[page]: true,
					};
				});
			}
			break;

		case 'delete':
			updatedPermissions = {
				...prevPermissions,
				[pageId.to]: true,
			};
			break;

		default:
			break;
	}

	if (writeRemove) {
		const pagesToUpdate = getAllInnerPages(pageId, appPages);
		pagesToUpdate.forEach((page: any) => {
			if (page !== pageId.to) {
				updatedPermissions = {
					...updatedPermissions,
					[page]: false,
				};
			}
		});
	}

	return updatedPermissions;
};

const getAllInnerPages = (pageId: any, appPages: any) => {
	const page = appPages[pageId.appKey];
	if (page) {
		const innerPages = Object.values(page).reduce((acc: string[], childRoutes: any) => {
			if (typeof childRoutes === 'object' && childRoutes.to) {
				acc.push(childRoutes.to);
			}
			return acc;
		}, []);
		return innerPages;
	}
	return [];
};

const filterPermissions = (data: any) => {
	return Object.fromEntries(Object.entries(data).filter(([_, value]) => value === true));
};

const extractInnerRoutes = (pages: any, value: any) => {
	let pagesArray: any = [];
	const traversePages = (pages: any) => {
		Object.values(pages).forEach((page: any) => {
			if (page) {
				const innerPages = Object.values(page).reduce((acc: string[], childRoutes: any) => {
					if (typeof childRoutes === 'object' && childRoutes.to) {
						acc.push(childRoutes.to);
					}
					return acc;
				}, []);
				pagesArray = [...pagesArray, ...innerPages];
			}
		});
	};

	// Start traversing from the root level of pages
	traversePages(pages);
	let permissionData: any = {};
	pagesArray?.forEach((key: any) => {
		permissionData[key] = value;
	});

	return permissionData;
};

const handleSelectAllPermission = (
	actionType: string,
	value: boolean,
	pagesToCheck: string[],
	appPages: any,
	setPermissionsCred: React.Dispatch<React.SetStateAction<any>>,
	setPermissions: React.Dispatch<React.SetStateAction<any>>,
	setSelectAllValues: React.Dispatch<React.SetStateAction<any>>,
	selectAllValues: any,
) => {
	const allReadPermissions = allReadPermissionsTrueData(pagesToCheck, value);
	const pagesToUpdate = extractInnerRoutes(appPages, value);

	setPermissionsCred((prevState: any) => {
		const updatedPermissions = { ...prevState };

		Object.keys(updatedPermissions).forEach((key) => {
			updatedPermissions[key][actionType] = value;

			if (value && actionType !== 'read') {
				updatedPermissions[key]['read'] = true;
				setSelectAllValues((prevState: any) => ({
					...prevState,
					['read']: true,
				}));
			}
		});

		switch (actionType) {
			case 'read':
				setPermissions(allReadPermissions);
				if(!value){
					Object.keys(updatedPermissions).forEach((key) => {
							updatedPermissions[key]['write'] = false;
							updatedPermissions[key]['delete'] = false;
							setSelectAllValues((prevState: any) => ({
								...prevState,
								['write']: false,
								['delete']: false,
								selectedAll:false
							}));
					});
				}
				break;
			case 'write':
				setPermissions({ ...pagesToUpdate, '/add-payment': false });
				if (!value && selectAllValues.read) {
					setPermissions(allReadPermissions);
				}
				break;
			default:
				console.error('Unknown action type:', actionType);
		}

		return updatedPermissions;
	});
};


// const checkAllPermissionsTrue = (permissions: any ,permissionType:any) => {
// 	console.log(permission,"alkjdsalsdjlsakdhlsakjhd")
// 	return Object.values(permissions).every((permission: any) => {
// 	  return permission[permissionType] === true
// 	});
//   };

  
const isSelectedAll = (pages: any, permissions: any) => {
	const data = Object.keys(extractInnerRoutes(pages, true));

	const allPermissionsTrue = data.every((page) => {
		return permissions[page] === true;
	});
	return allPermissionsTrue;
};

const updateCredPermissions = (
	prevPermissions: any,
	pageId: any,
	type: 'read' | 'write' | 'delete',
) => {
	// Clone the previous permissions state
	const updatedPermissions = { ...prevPermissions };

	// Initialize new permissions object if it doesn't exist for the pageId
	if (!updatedPermissions[pageId]) {
	  updatedPermissions[pageId] = {
		read: false,
		write: false,
		delete: false,
	  };
	}
  
	// Toggle the specified type (read, write, delete)
	updatedPermissions[pageId][type] = !prevPermissions[pageId]?.[type];
  
	// Ensure 'read' is true if 'write' or 'delete' is being toggled on
	if ((type === 'write' || type === 'delete') && updatedPermissions[pageId][type]) {
	  updatedPermissions[pageId].read = true;
	}
  
	// Ensure 'write' and 'delete' are false if 'read' is set to false
	if (type === 'read' && !updatedPermissions[pageId].read) {
	  updatedPermissions[pageId].write = false;
	  updatedPermissions[pageId].delete = false;
	}
  
	return updatedPermissions;
};

export {
	togglePermissionAndUpdateInnerPages,
	filterPermissions,
	getAllInnerPages,
	shouldRedirectOrShowLoader,
	extractInnerRoutes,
	allReadPermissionsTrueData,
	handleSelectAllPermission,
	updateCredPermissions,
	isSelectedAll,
	// checkAllPermissionsTrue
};
