import { useEffect, useState } from 'react';
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../components/ui/Card';
import TableTemplate, {
    TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import { get, post } from '../../../../utils/api-helper.util';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import Collapse from '../../../../components/utils/Collapse';
import Input from '../../../../components/form/Input';
import { SubheaderRight } from '../../../../components/layouts/Subheader/Subheader';



const columnHelper = createColumnHelper<any>();


const PurchaseEntryDetail = ({ productsArray, branchesData, poId }: any) => {

    console.log("productsArray", productsArray)

    const [sorting, setSorting] = useState<SortingState>([]);
    const [editedData, setEditedData] = useState<{ [key: string]: any }>({});
    // const [branchesData, setBranchesData] = useState<any>()
    const [selectedBranches, setSelectedBranches] = useState<any>({});

    const [purchaseEntry, setPurchaseEntry] = useState<any>()
    const [isNewPurchaseEntry, setIsNewPurchaseEntry] = useState(false);
    const [collapseAll, setCollapseAll] = useState<boolean>(false);
    // const [collapsible, setCollapsible] = useState(true)
    // const [collapsibleEntryList, setCollapsibleEntryList] = useState(true)
    const [accordionStates, setAccordionStates] = useState({
        collapsible: false,
        collapsibleEntryList: false,

    });

    const handleReceivedQuantityChange = (id: string, value: string) => {
        setEditedData((prevData) => ({
            ...prevData,
            [id]: {
                ...prevData[id], // Preserve other properties of the row
                receivedQuantity: value,
                branch: selectedBranches[id] ?? selectedBranches,
            },
        }));
    };

    const columns = [
        columnHelper.accessor('product.name', {
            cell: (info) => (

                <div className=''>{`${info.getValue()}`}</div>

            ),
            header: 'Product Name',

        }),
        columnHelper.accessor('product.productCode', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Product Code',
        }),
        columnHelper.accessor('requiredQuantity', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Requried Quanity',
        }),

        columnHelper.accessor('pendingQuantity', {
            cell: (info) => (
                <div className=''>
                    {info?.cell?.row?.original?.requiredQuantity - info?.cell?.row?.original?.receivedQuantity}
                </div>
            ),
            header: 'Pending Quantity',
            // enableHiding: true

        }),

        // columnHelper.accessor('receivedQuantity', {
        //     cell: (info) => (
        //         <div className=''>
        //             <input
        //                 type='number'
        //                 value={editedData[info.row.id]?.receivedQuantity ?? info.getValue()}
        //                 onChange={(e) =>
        //                     handleReceivedQuantityChange(info.row.id, e.target.value)
        //                 }
        //                 disabled={!isNewPurchaseEntry}
        //             />
        //         </div>
        //     ),
        //     header: 'Received Quantity',
        // }),
        columnHelper.accessor('receivedQuantity', {
            cell: (info) => (
                <div className=''>
                    <input
                        type='number'
                        value={editedData[info.row.id]?.receivedQuantity ?? info.getValue()}
                        onChange={(e) =>
                            handleReceivedQuantityChange(info.row.id, e.target.value)
                        }
                        disabled={!isNewPurchaseEntry || info.row.original.status === 'completed'}
                    />
                </div>
            ),
            header: 'Received Quantity',
        }),

        // columnHelper.accessor('selectBranch', {
        //     cell: (info) => (

        //         // console.log("info", info)
        //         <div className=''>
        //             <Select
        //                 id={`branch-${info.row.id}`}
        //                 name={`branch-${info.row.id}`}
        //                 value={selectedBranches[info.row.id] ?? selectedBranches[info.row.id]}
        //                 placeholder='Select branch'
        //                 onChange={(e: any) => {
        //                     setSelectedBranches((prevBranches: any) => ({
        //                         ...prevBranches,
        //                         [info.row.id]: e.target.value,
        //                     }));
        //                 }}
        //                 disabled={!isNewPurchaseEntry}
        //             >
        //                 {branchesData &&
        //                     branchesData.length > 0 &&
        //                     branchesData?.map((data: any) => (
        //                         <option key={data._id} value={data._id}>
        //                             {data.name}
        //                         </option>
        //                     ))}
        //             </Select>

        //         </div>
        //     ),
        //     header: 'Select Branch',
        // }),
        columnHelper.accessor('selectBranch', {
            cell: (info) => (
                <div className=''>
                    <Select
                        id={`branch-${info.row.id}`}
                        name={`branch-${info.row.id}`}
                        value={selectedBranches[info.row.id] ?? selectedBranches[info.row.id]}
                        placeholder='Select branch'
                        onChange={(e: any) => {
                            setSelectedBranches((prevBranches: any) => ({
                                ...prevBranches,
                                [info.row.id]: e.target.value,
                            }));
                        }}
                        disabled={!isNewPurchaseEntry || info.row.original.status === 'completed'}
                    >
                        {branchesData &&
                            branchesData.length > 0 &&
                            branchesData?.map((data: any) => (
                                <option key={data._id} value={data._id}>
                                    {data.name}
                                </option>
                            ))}
                    </Select>
                </div>
            ),
            header: 'Select Branch',
        }),

        columnHelper.accessor('status', {
            cell: (info) => (

                <div className=''>
                    {`${info.getValue()}`}
                </div>

            ),
            header: 'Status',
        }),

    ];
    const table = useReactTable({
        data: productsArray && productsArray,
        columns,
        state: {
            sorting,
        },
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
    });


    const getPurchaseEntryData = async () => {

        try {
            const { data: allProductList } = await get(`/purchase-order/purchaseEntry/${poId}`);
            setPurchaseEntry(allProductList);
            purchaseEntryTable.setGlobalFilter(allProductList)
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        } finally {
        }
    };



    useEffect(() => {
        getPurchaseEntryData()
    }, [])




    const purchaseEntryColumns = [
        columnHelper.accessor('products', {
            cell: (info) => (
                <div>
                    {info?.row?.original?.products.map((product: any, index: number) => (
                        <div key={index}>{product.product.name}</div>
                    ))}
                </div>
            ),
            header: 'Name',
        }),
        columnHelper.accessor('products', {
            cell: (info) => (
                <div>
                    {info?.row?.original?.products.map((product: any, index: number) => (
                        <div key={index}>{product.receivedQuantity}</div>
                    ))}
                </div>
            ),
            header: 'Received Quantity',
        }),

        columnHelper.accessor('products', {
            cell: (info) => (
                <div>
                    {info?.row?.original?.products.map((product: any, index: number) => (
                        <div key={index}>{product.branch.name}</div>
                    ))}
                </div>
            ),
            header: 'Branch',
        }),
    ];


    const purchaseEntryTable = useReactTable({
        data: purchaseEntry && purchaseEntry?.length > 0 && purchaseEntry || [],
        columns: purchaseEntryColumns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        enableGlobalFilter: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleNewPurchaseEntry = () => {
        setIsNewPurchaseEntry(true);

    };
    const collapseAllAccordians = () => {
        setAccordionStates({
            collapsible: !collapseAll,
            collapsibleEntryList: !collapseAll
        });
        setCollapseAll(!collapseAll);
    };
    const handleSave = async () => {
        const saveData = table.getFilteredRowModel().rows.map((row: any, index: number) => ({
            product: row.original.product._id,
            receivedQuantity: parseFloat(editedData[row.id]?.receivedQuantity ?? row.original.receivedQuantity),
            requiredQuantity: parseFloat(row.original.requiredQuantity), // Ensure requiredQuantity is converted to number
            branch: selectedBranches[index],
        }));

        try {
            const invalidEntries = saveData.filter((entry: any) => entry.receivedQuantity > entry.requiredQuantity);
            if (invalidEntries.length > 0) {
                toast.error('Received quantity cannot be greater than required quantity for some products');
                console.log("invalid entries", invalidEntries); // Log invalid entries for debugging
                return;
            }

            const products = saveData;
            const final = { products };
            const branches = await post(`/purchase-order/registerPurchaseEntry/${poId}`, final);
            console.log("Branches", branches);
            toast.success('Product added to inventory');
            getPurchaseEntryData();
        } catch (error: any) {
            console.error("Error Saving Branch", error);
            toast.error('Error Saving Branch', error);
        }
        finally {
            // navigate(PathRoutes.branches);
        }
    };

    // const handleSave = async () => {
    //     const saveData = table.getFilteredRowModel().rows.reduce((accumulator: any[], row: any) => {
    //         if (row.original.status !== 'completed') {
    //             accumulator.push({
    //                 product: row.original.product._id,
    //                 receivedQuantity: editedData[row.id]?.receivedQuantity ?? row.original.receivedQuantity,
    //                 branch: selectedBranches[row.id],
    //             });
    //         }
    //         return accumulator;
    //     }, []);

    //     try {
    //         const invalidEntries = saveData.filter((entry: any) => entry.receivedQuantity > entry.requiredQuantity);
    //         if (invalidEntries.length > 0) {
    //             toast.error('Received quantity cannot be greater than required quantity for some products');
    //             return;
    //         }

    //         if (saveData.length === 0) {
    //             toast.error('All Products Data status has completed');
    //             return;
    //         }

    //         console.log("saveData", saveData, saveData.length);

    //         const branches = await post(`/purchase-order/registerPurchaseEntry/${poId}`, { products: saveData });
    //         console.log("Branches", branches);
    //         toast.success('Product added to inventory');
    //         getPurchaseEntryData();
    //     } catch (error: any) {
    //         console.error("Error Saving Branch", error)
    //         toast.error('Error Saving Branch', error)
    //     }
    //     finally {
    //         // navigate(PathRoutes.branches);
    //     }
    // };





    //     const saveData = table.getFilteredRowModel().rows.map((row: any, index: number) => ({
    //         product: row.original.product._id,
    //         receivedQuantity: parseFloat(editedData[row.id]?.receivedQuantity ?? row.original.receivedQuantity),
    //         branch: selectedBranches[index],
    //     }));

    //     try {
    //         // Additional validation for received quantity
    //         const invalidEntries = saveData.filter((entry: any) => entry.receivedQuantity > entry.requiredQuantity);
    //         if (invalidEntries.length > 0) {
    //             toast.error('Received quantity cannot be greater than required quantity for some products');
    //             return;
    //         }

    //         // Ensure that products field is an array
    //         const formattedData = saveData.map(entry => ({ products: [entry] }));

    //         // Perform API call to save data
    //         const response = await post(`/purchase-order/registerPurchaseEntry/${poId}`, formattedData);

    //         if (response.statusCode === 400) {
    //             // Handle the error response from the server
    //             toast.error(response.message[0]);
    //         } else if (response.status === 'success') {
    //             toast.success('Purchase entry saved successfully');
    //             getPurchaseEntryData(); // Refresh data if necessary
    //         } else {
    //             toast.error('Failed to save purchase entry');
    //         }
    //     } catch (error: any) {
    //         console.error("Error Saving Branch", error);
    //         // Show error toast message
    //         toast.error('Error saving purchase entry');
    //     }
    // };



    return (

        <div>
            <PageWrapper name='Product List'>
                <SubheaderRight>
                    <div className='col-span-1'>
                        <Button
                            variant='solid'
                            color='emerald'
                            className='mr-5 mt-4'
                            onClick={() => collapseAllAccordians()}
                        >

                            {!collapseAll ? 'Collapse All Information' : 'Expand All Information'}
                        </Button>
                    </div>
                </SubheaderRight>
                <Container>
                    <Card >
                        <CardBody>
                            <div className='flex'>
                                <div className='bold w-full'>
                                    <Button
                                        variant='outlined'
                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                        onClick={() =>
                                            setAccordionStates({
                                                ...accordionStates,
                                                collapsible: !accordionStates.collapsible,
                                            })
                                        }
                                        rightIcon={
                                            !accordionStates.collapsible
                                                ? 'HeroChevronUp'
                                                : 'HeroChevronDown'
                                        }>
                                        <h2 className='text-gray-700'> Purchased Products List </h2>
                                    </Button>
                                </div>
                            </div>


                            <Collapse isOpen={!accordionStates.collapsible}>
                                <div className="flex justify-end mt-5 ">
                                    <Button variant='solid' icon='HeroPlus' onClick={() => { handleNewPurchaseEntry() }}>
                                        New Purchase Entry
                                    </Button>
                                </div>
                            </Collapse>
                        </CardBody>


                        <Collapse isOpen={!accordionStates.collapsible}>
                            <CardHeader>
                                <CardHeaderChild>
                                </CardHeaderChild>
                            </CardHeader>
                            <CardBody className='overflow-auto'>

                                <TableTemplate
                                    className='table-fixed max-md:min-w-[70rem]'
                                    table={table}
                                />
                            </CardBody>

                            <TableCardFooterTemplate table={table} />
                            <div style={{ display: "flex", justifyContent: "end", marginRight: "100px", marginTop: "20px" }}>

                                <Button variant='solid' isDisable={!isNewPurchaseEntry} onClick={handleSave} >
                                    SAVE Purchase Entry
                                </Button>
                            </div>
                        </Collapse>
                    </Card>
                </Container>
            </PageWrapper >
            <PageWrapper>
                <Container>
                    <Card>
                        <CardBody>
                            <div className='flex'>
                                <div className='bold w-full'>
                                    <Button
                                        variant='outlined'
                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                        onClick={() =>
                                            setAccordionStates({
                                                ...accordionStates,
                                                collapsibleEntryList: !accordionStates.collapsibleEntryList,
                                            })
                                        }
                                        rightIcon={
                                            !accordionStates.collapsibleEntryList
                                                ? 'HeroChevronUp'
                                                : 'HeroChevronDown'
                                        }>
                                        <h2 className='text-gray-700'>Purchased Entry List</h2>
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                        <Collapse isOpen={!accordionStates.collapsibleEntryList}>
                            <CardHeader className='mt-5'>
                                <CardHeaderChild>
                                </CardHeaderChild>
                            </CardHeader>
                            {
                                purchaseEntry?.length > 0 ?
                                    (
                                        <CardBody className='overflow-auto'>

                                            <TableTemplate
                                                className='table-fixed max-md:min-w-[70rem]'
                                                table={purchaseEntryTable}
                                            />
                                            <TableCardFooterTemplate table={purchaseEntryTable} />
                                        </CardBody>
                                    ) :
                                    <div style={{ textAlign: 'center' }}>
                                        No Records Available
                                    </div>
                            }
                        </Collapse>
                    </Card>
                </Container>
            </PageWrapper>


        </div >
    )

};

export default PurchaseEntryDetail;

