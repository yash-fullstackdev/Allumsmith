import React, { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Modal, { ModalBody, ModalFooter, ModalFooterChild, ModalHeader } from "../../../../components/ui/Modal";
import TableTemplate, { TableCardFooterTemplate } from "../../../../templates/common/TableParts.template";
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import Card, {
  CardBody,
  CardHeader,
  CardHeaderChild,
  CardTitle,
} from "../../../../components/ui/Card";
import Badge from "../../../../components/ui/Badge";
import { get } from "../../../../utils/api-helper.util";
type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  viewData: any;
};

const columnHelper = createColumnHelper<any>();
const ViewTransportModal = ({ isOpen, setIsOpen, viewData }: props) => {
  const [branchData, setBranchData] = useState<any>([]);

  const dateString = viewData?.dispatch_date.split('T')[0];

  const [year, month, day] = dateString.split('-');
  const dispatchDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  const branchDetails = useMemo(() => {
    const fromBranch = branchData?.find((item: any) => item?._id === viewData?.from_branch)?.name
    const toBranch = branchData?.find((item: any) => item?._id === viewData?.to_branch)?.name
    return { fromBranch, toBranch }
  }, [viewData, branchData]);


  const fetchBranchData = async () => {
    try {
      const { data: branchesList } = await get(`/branches`);
      branchesList.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setBranchData(branchesList);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    fetchBranchData();
  }, []);





  const columns: any = [
    columnHelper.accessor('co_id', {
      cell: (info) => {
     
        return (
          <div>
            {info?.row?.original?.co_id?.customer?.name}
          </div>
        )
      },
      header: 'Customer Name',
    }),

    columnHelper.accessor('name', {
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.products.map((product: any, index: number) => (
              <div key={index}>{product.name}</div>
            ))}
          </div>
        )
      },
      header: 'Product Name',
    }),

    columnHelper.accessor('coating', {
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.products.map((product: any, index: number) => (
              <div key={index}>{product.coating?.name}</div>
            ))}
          </div>
        )
      },
      header: 'Coating',
    }),
    columnHelper.accessor('color', {
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.products.map((product: any, index: number) => (
              <div key={index}>{product.color?.name}</div>
            ))}
          </div>
        )
      },
      header: 'color',
    }),

    columnHelper.accessor('pick_quantity', {
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.products.map((product: any, index: number) => (
              <div key={index}>{product.pick_quantity}</div>
            ))}
          </div>
        )
      },
      header: 'Pick Quantity',
    }),
  ];

  const table = useReactTable({
    data: viewData?.batch || [],
    columns,
    // state: {
    //     sorting,
    //     globalFilter,
    // },
    // onSortingChange: setSorting,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selfColumns: any = [

    columnHelper.accessor('name', {
      cell: (info) => (

        <div className=''>
          {`${info.getValue() || '-'} `}
        </div>

      ),
      header: 'Product Name',
    }),

    columnHelper.accessor('coating', {

      cell: (info) => {
        return (
          <div>
            {info.getValue()?.name || '-'}
          </div>
        )
      },
      header: 'Coating',
    }),
    columnHelper.accessor('color', {
      cell: (info) => (
        <div className=''>
          {info.getValue()?.name || '-'}
        </div>
      ),
      header: 'Color',
    }),
    columnHelper.accessor('pick_quantity', {
      cell: (info) => (
        <div className=''>
          {info.getValue() || '-'}
        </div>
      ),
      header: 'Pick Quantity',
    }),
  ];
  const selfProductTable = useReactTable({
    data: viewData?.self_products || [],
    columns: selfColumns,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen>
      <ModalHeader
        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
      >
        <div>
          <h2 className="italic text-sm mt-2 text-gray-500">
            Dispatch Date: {dispatchDate}
          </h2>
          <h4 className="italic text-sm mt-2 text-gray-500">
            From Branch: {branchDetails?.fromBranch}
          </h4>
          <div>
            <h4 className="italic text-sm text-gray-500">
              To Branch: {branchDetails?.toBranch}
            </h4>
          </div>
          <h4 className="italic text-sm text-gray-500">
            Vehicle No: {viewData?.vehicle_no}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <PageWrapper>
          <Container>
            <Card className='h-full'>

              <CardBody className='overflow-auto'>

                <CardHeaderChild className="mb-3">
                  <CardTitle>Customer Products</CardTitle>

                  <Badge
                    variant='outline'
                    className='border-transparent px-4 '
                    rounded='rounded-full'>
                    {table.getFilteredRowModel().rows.length} items
                  </Badge>
                </CardHeaderChild>
                {table.getFilteredRowModel().rows.length > 0 ? (
                  <TableTemplate
                    className='table-fixed max-md:min-w-[70rem]'
                    table={table}
                  />
                ) : (
                  <p className="text-center text-gray-500">No records found</p>
                )}
                <div className=" m-[-13px] mt-2">
                  {table.getFilteredRowModel().rows.length > 0 &&
                    <TableCardFooterTemplate table={table} />
                  }
                </div>
                <CardHeaderChild className="mt-7 mb-3">
                  <CardTitle >Self Products</CardTitle>
                  <Badge
                    variant='outline'
                    className='border-transparent px-4 '
                    rounded='rounded-full'>
                    {selfProductTable.getFilteredRowModel().rows.length} items
                  </Badge>
                </CardHeaderChild>

                {selfProductTable.getFilteredRowModel().rows.length > 0 ? (
                  <TableTemplate
                    className='table-fixed max-md:min-w-[70rem]'
                    table={selfProductTable}
                  />
                ) : (
                  <p className="text-center text-gray-500">No records found</p>
                )}
                <div className=" m-[-13px] mt-2">
                  {selfProductTable.getFilteredRowModel().rows.length > 0 &&
                    <TableCardFooterTemplate table={selfProductTable} />
                  }
                </div>
              </CardBody>
            </Card>
          </Container>
        </PageWrapper>
      </ModalBody>
    </Modal>
  )
}

export default ViewTransportModal;

