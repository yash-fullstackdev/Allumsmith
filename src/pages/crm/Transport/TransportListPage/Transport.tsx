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
import { get } from '../../../../utils/api-helper.util';
import ConfirmDelete from '../TransportPage/ConfirmDelete';
import PermissionGuard from '../../../../components/buttons/CheckPermission';


const columnHelper = createColumnHelper<any>();
const TransportPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [transportData, setTransportData] = useState<any>([]);
  const [transparentViewData, setTransparentViewData] = useState<any>({});
  const [selectStatusId, setSelectStatusId] = useState("")


  const getTransportDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await get('/transport');
      setTransportData(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error('Error Fetching Customer Order');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTransportDetails()
  }, []);

  const columns: any = [
    columnHelper.accessor('dispatch_date', {
      cell: (info) => {
        const dateString = info?.row?.original?.dispatch_date.split('T')[0];

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

    columnHelper.accessor('vehicle_no', {
      cell: (info) => (

        <div className=''>
          {`${info.getValue() || '-'} `}
        </div>

      ),
      header: 'Vehicle number ',
    }),

    columnHelper.accessor('status', {
      cell: (info) => {
        const status = () => {
          switch (info.getValue()) {
            case "pending":
              return "Pending";
            case "in_transit":
              return "In Transit";
            case "completed":
              return "Completed";

            default:
              return null;
          }
        }
        return (
          <div className=''>
            {status() || '-'}
          </div>
        )
      },
      header: 'Status',
    }),



    columnHelper.display({
      cell: (info) => (
        <div className='font-bold' >
          {/* update status icon  */}
         <PermissionGuard permissionType='write'>
         <Button
            onClick={() => {
              setIsOpenStatus(!isOpenView)
              setSelectStatusId(info.row.original?._id)
            }}
            isDisable={info.row.original.status === 'completed'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
            </svg>
          </Button>
         </PermissionGuard>

          {/* view icon  */}
          <Button
            onClick={() => {
              setIsOpenView(!isOpenView)
              setTransparentViewData(info.row.original)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </Button>

          {/* delete icon */}
          <PermissionGuard permissionType='delete'>
          <Button
            onClick={() => {
              setIsConfirmDelete(true);
              setSelectStatusId(info.row.original?._id)
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
              />
            </svg>
          </Button>
          </PermissionGuard>
        </div>
      ),
      header: 'Actions',
      size: 140,
    }),



  ];

  const table = useReactTable({
    data: transportData || [],
    columns,

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
           <PermissionGuard permissionType='write'>
           <CardHeaderChild>
              <Link to={`${PathRoutes.add_transport}`}>
                <Button variant='solid' icon='HeroPlus'>
                  New Transport
                </Button>
              </Link>
            </CardHeaderChild>
           </PermissionGuard>
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
            viewData={transparentViewData}
          /> : null
        }
        {isOpenStatus ?
          <UpdateStatusModal
            isOpen={true}
            setIsOpen={setIsOpenStatus}
            selectStatusId={selectStatusId}
            getTransportDetails={getTransportDetails}
          /> : null
        }
        {isConfirmDelete ?
          <ConfirmDelete
            isOpen={true}
            setIsOpen={setIsConfirmDelete}
            selectStatusId={selectStatusId}
            setSelectStatusId={setSelectStatusId}
            getTransportDetails={getTransportDetails}
          /> : null
        }
      </Container>
    </PageWrapper>
  );
};



export default TransportPage;

