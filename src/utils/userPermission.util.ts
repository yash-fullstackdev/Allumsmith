import { appPages } from "../config/pages.config";

const checkUserId = (userId: any, trueValue: any, falseValue: any) => {
    if (!userId) {
        return trueValue;
    } else {
        return falseValue;
    }
};


const updateRoutePermissions = (route: string, value: boolean, prevPermissions: any) => {
	return {
		...prevPermissions,
		[route]: {
			...(prevPermissions[route] || {
				read: false,
				write: false,
				delete: false,
			}),
			read: value,
			write: value,
			delete: value,
		},
	};
};



const initializePermissions = (pageId: any, prevPermissions: any) => {
    return {
        ...prevPermissions,
        [pageId]: {
            ...(prevPermissions[pageId] || {
                read: false,
                write: false,
                delete: false,
            }),
        },
    };
};

const updatePermissions = (pageId: any, type: any, prevPermissions: any) => {
    const updatedPermissions = initializePermissions(pageId, prevPermissions);
    updatedPermissions[pageId][type] = !prevPermissions[pageId]?.[type];

    if ((type === 'write' || type === 'delete') && updatedPermissions[pageId][type]) {
        updatedPermissions[pageId].read = true;
    }

    if (type === 'read' && !updatedPermissions[pageId].read) {
        updatedPermissions[pageId].write = false;
        updatedPermissions[pageId].delete = false;
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

const updateInnerPagePermissions = (
	pageId: string,
	value: boolean,
	prevPermissions: any,
	appPages: any
) => {
	return togglePermissionAndUpdateInnerPages(
		pageId,
		prevPermissions,
		appPages,
		'write',
		value
	);
};




const updateSelectAllValues = (permissionCred: any) => {
	const updatedSelectedRawValue: any = {};
	let allRead = true;
	let allWrite = true;
	let allDelete = true;

	for (const route in permissionCred) {
		const { read, write, delete: del } = permissionCred[route];
		if (read && write && del) {
			updatedSelectedRawValue[route] = true;
		} else {
			updatedSelectedRawValue[route] = false;

			if (!read) allRead = false;
			if (!write) allWrite = false;
			if (!del) allDelete = false;
		}
	}

	return {
		updatedSelectedRawValue,
		selectAllValues: {
			read: allRead,
			write: allWrite,
			delete: allDelete,
			selectedAll: allRead && allWrite && allDelete,
		},
	};
};

const handelAllSelections = (value: boolean) => ({
	read: value,
	write: value,
	delete: value,
	selectedAll: value,
});


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
	traversePages(pages);
	let permissionData: any = {};
	pagesArray?.forEach((key: any) => {
		permissionData[key] = value;
	});

	return permissionData;
};

const createPermissionsData = (pages: any, value: any) => {
	const permissions: any = {};

	const addPermissions = (route: any) => {
		permissions[route] = {
			read: value,
			write: value,
			delete: value,
		};
	};

	Object.values(pages).forEach((pageGroup: any) => {
		addPermissions(pageGroup?.listPage?.to);
	});

	return permissions;
};

const handelSelectAllRawData = (value:boolean) =>{
	const newPermissions = extractInnerRoutes(appPages, value);
		const newIsSelectedRawValue: any = {};
		Object.keys(newPermissions).forEach((route: any) => {
			newIsSelectedRawValue[route] = value;
		});
		
		return newIsSelectedRawValue
}


const updatePermissionsStates = (
	value: boolean,
	setPermissions: React.Dispatch<React.SetStateAction<any>>,
	setPermissionsCred: React.Dispatch<React.SetStateAction<any>>,
	setIsSelectedRawValue: React.Dispatch<React.SetStateAction<any>>,
) => {
	setPermissions(extractInnerRoutes(appPages, value));
	setPermissionsCred(createPermissionsData(appPages, value));
	setIsSelectedRawValue(handelSelectAllRawData(value));
};




const allReadPermissionsTrueData = (pagesToCheck: any, value: boolean) =>
	pagesToCheck.reduce((result: any, page: any) => {
		result[page] = value;
		return result;
	}, {});


const filterPermissions = (data: any) => {
	return Object.fromEntries(Object.entries(data).filter(([_, value]) => value === true));
};



const updatePermissionsState = (
	actionType: string,
	value: boolean,
	permissions: any,
	setSelectAllValues: React.Dispatch<React.SetStateAction<any>>,
) => {
	const updatedPermissions = { ...permissions };

	Object.keys(updatedPermissions).forEach((key) => {
		updatedPermissions[key][actionType] = value;

		if (value && actionType !== 'read') {
			updatedPermissions[key]['read'] = true;
			setSelectAllValues((prevValues: any) => ({
				...prevValues,
				read: true,
			}));
		}
	});

	if (actionType === 'read' && !value) {
		Object.keys(updatedPermissions).forEach((key) => {
			updatedPermissions[key]['write'] = false;
			updatedPermissions[key]['delete'] = false;
		});
		setSelectAllValues((prevValues: any) => ({
			...prevValues,
			write: false,
			delete: false,
			selectedAll: false,
		}));
	}

	return updatedPermissions;
};

const handleSelectAllPermission = (
	actionType: string,
	value: boolean,
	pagesToCheck: string[],
	appPages: any,
	setPermissionsCred: React.Dispatch<React.SetStateAction<any>>,
	setPermissions: React.Dispatch<React.SetStateAction<any>>,
	// setSelectAllValues: React.Dispatch<React.SetStateAction<any>>,
	selectAllValues: any
) => {
	const allReadPermissions = allReadPermissionsTrueData(pagesToCheck, value);
	const pagesToUpdate = extractInnerRoutes(appPages, value);

	setPermissionsCred((prevState: any) => {
		const updatedPermissions = updatePermissionsState(
			actionType,
			value,
			prevState,
			setPermissions,
		);

		if (actionType === 'read') {
			setPermissions(allReadPermissions);
		} else if (actionType === 'write' && !value && selectAllValues.read) {
			setPermissions(allReadPermissions);
		} else {
			setPermissions({ ...pagesToUpdate, '/add-payment': false });
		}

		return updatedPermissions;
	});
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
    updateSelectAllValues,
    checkUserId,
    updateInnerPagePermissions,
    updateRoutePermissions,
    updatePermissions,
    updatePermissionsStates,
    handelAllSelections,
    updateCredPermissions,
    handleSelectAllPermission,
    filterPermissions,
    togglePermissionAndUpdateInnerPages,
    createPermissionsData
}