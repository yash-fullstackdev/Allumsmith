import React, { type Dispatch, type SetStateAction } from "react";
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
type props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const columnHelper = createColumnHelper<any>();
const ViewTransportModal = ({ isOpen, setIsOpen }: props) => {

  const columns: any = [
    columnHelper.accessor('createdAt', {
      cell: (info) => {
        const dateString = info?.row?.original?.createdAt.split('T')[0];

        const [year, month, day] = dateString.split('-');
        const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;

        return (
          <div className=''>
            {formattedDate || '-'}
          </div>
        );
      },
      header: 'Date',
    }),

    columnHelper.accessor('vehicleNumber', {
      cell: (info) => (

        <div className=''>
          {`${info.getValue() || '-'} `}
        </div>

      ),
      header: 'Vehicle number ',
    }),

    columnHelper.accessor('status', {
      cell: (info) => (
        <div className=''>
          {info.getValue() || '-'}
        </div>
      ),
      header: 'Status',
    }),
  ];

  const table = useReactTable({
    data: fakeData || [],
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
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen>
      <ModalHeader
        className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
      >
        <div>
          <h2 className="italic text-sm mt-2 text-gray-500">
            Date: {"12/06/2024"}
          </h2>
          <h4 className="italic text-sm mt-2 text-gray-500">
            From Branch: {"Ghatlodiya Shop"}
          </h4>
          <div>
            <h4 className="italic text-sm text-gray-500">
              To Branch: {"Santej Godown"}
            </h4>
          </div>
          <h4 className="italic text-sm text-gray-500">
            Vehicle No: {"GJ05kk7854"}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>



        <PageWrapper>
          <Container>
            <Card className='h-full'>
              <CardHeader>
                <CardHeaderChild>
                  <CardTitle>Transport</CardTitle>
                  <Badge
                    variant='outline'
                    className='border-transparent px-4 '
                    rounded='rounded-full'>
                    {table.getFilteredRowModel().rows.length} items
                  </Badge>
                </CardHeaderChild>


              </CardHeader>
              <CardBody className='overflow-auto'>
                {table.getFilteredRowModel().rows.length > 0 ? (
                  <TableTemplate
                    className='table-fixed max-md:min-w-[70rem]'
                    table={table}
                  />
                ) : (
                  <p className="text-center text-gray-500">No records found</p>
                )}
              </CardBody>
              {table.getFilteredRowModel().rows.length > 0 &&
                <TableCardFooterTemplate table={table} />
              }
            </Card>
          </Container>
        </PageWrapper>
      </ModalBody>
    </Modal>
  )
}

export default ViewTransportModal;


const fakeData = [
  {
    type: "debit",
    status: "active",
    vehicleNumber: "GJ32dd4025",
    createdAt: "2024-06-11T11:21:44.007Z",
    updatedAt: "2024-06-11T11:21:44.007Z",
    __v: 0,
  },
  {
    status: "active",
    vehicleNumber: "GJ32dd6025",
    createdAt: "2024-06-11T11:23:39.882Z",
    updatedAt: "2024-06-11T11:23:39.882Z",
    __v: 0,
  },
]