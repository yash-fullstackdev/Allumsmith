import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import Button from '../../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import ViewTransportModal from '../TransportPage/ViewTransportModal';
import UpdateStatusModal from '../TransportPage/UpdateStatusModal';
import { get } from '../../../../utils/api-helper.util';
import ConfirmDelete from '../TransportPage/ConfirmDelete';
import { Container, PageWrapper } from '../../../../components/layouts';


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
          <Button
            onClick={() => {
              setIsOpenStatus(!isOpenView)
              setSelectStatusId(info.row.original?._id)
            }}
            isDisable={info.row.original.status === 'completed'}
            icon='HeroAction'
            className='px-2.5'
          />

          {/* view icon  */}
          <Button
            onClick={() => {
              setIsOpenView(!isOpenView)
              setTransparentViewData(info.row.original)
            }}
            icon='HeroEye'
            className='px-2.5'
          />

          {/* delete icon */}
          <Button
            onClick={() => {
              setIsConfirmDelete(true);
              setSelectStatusId(info.row.original?._id)
            }}
            className='px-2.5'
            icon='HeroDelete'
          />
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

