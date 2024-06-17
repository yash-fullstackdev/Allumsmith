import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import Button from '../../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import ViewTransportModal from '../TransportPage/ViewTransportModal';
import UpdateStatusModal from '../TransportPage/UpdateStatusModal';


const columnHelper = createColumnHelper<any>();
const TransportPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);

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
    columnHelper.display({
      cell: () => (
        <div className='font-bold'>
          <Button onClick={() => setIsOpenStatus(!isOpenView)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
            </svg>
          </Button>

          <Button onClick={() => setIsOpenView(!isOpenView)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </Button>
        </div>
      ),
      header: 'Actions',
      size: 140,
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
    <PageWrapper name='Powder Inventory List'>
      <Container>
        <Card>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle><h1>Transport</h1></CardTitle>
            </CardHeaderChild>
            <CardHeaderChild>
              <Link to={`${PathRoutes.add_transport}`}>
                <Button variant='solid' icon='HeroPlus'>
                  New Transport
                </Button>
              </Link>
            </CardHeaderChild>
          </CardHeader>
          <CardBody>
            {!isLoading ? (
              table.getFilteredRowModel().rows.length > 0 ? (
                <TableTemplate
                  className='table-fixed max-md:min-w-[70rem]'
                  table={table}
                />
              ) : (
                <p className="text-center text-gray-500">No records found</p>
              )
            ) : (
              <div className="flex justify-center">
                <LoaderDotsCommon />
              </div>
            )}
          </CardBody>
          {!isLoading && table.getFilteredRowModel().rows.length > 0 &&
            <TableCardFooterTemplate table={table} />
          }
        </Card>
        {isOpenView ?
          <ViewTransportModal
            isOpen={true}
            setIsOpen={setIsOpenView}
          /> : null
        }
        {isOpenStatus ?
          <UpdateStatusModal
            isOpen={true}
            setIsOpen={setIsOpenStatus}
          /> : null
        }
      </Container>
    </PageWrapper>
  );
};



export default TransportPage;


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
];

