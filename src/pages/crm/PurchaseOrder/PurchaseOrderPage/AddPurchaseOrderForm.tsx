import { post } from '../../../../utils/api-helper.util';
import { useFormik } from 'formik';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import { purchaseOrderSchema } from '../../../../utils/formValidations';
import PurchaseOrderForm from '../../../../components/PageComponets/PurchaseOrderForm/PurchaseOrderForm';

const AddPurchaseOrderForm = () => {
  const navigate = useNavigate();

  const formik: any = useFormik({
    initialValues: {
      vendor: "",
      po_number: "",
      entries: [{ product: '', requiredQuantity: '' }],
    },
    validationSchema: purchaseOrderSchema,
    onSubmit: async (value) => {
      try {
        const duplicateProductIds = value?.entries
          .map((entry: any) => entry.product)
          .filter((productId: any, index: any, array: any) => array.indexOf(productId) !== index);
        if (duplicateProductIds.length > 0) {
          toast.error('You have selected the same product more than once');
          return;
        }

        const body = {
          vendor: value?.vendor,
          products: value?.entries || [],
          po_number: value?.po_number
        };

        const { data } = await post("/purchase-order", body);
        toast.success('Purchase Order Created Successfully!');
        navigate(PathRoutes.purchase_order);
      } catch (error: any) {
        toast.error(error.response.data.message, error);
      }
    }
  });

  const handleAddEntry = () => {
    formik.setFieldValue('entries', [...formik.values.entries, { product: '', requiredQuantity: '' }]);
  };

  return (
    <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
      <Card>
        <CardBody>
          <div
            className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
          >
            Add Purchase Order
          </div>
          <PurchaseOrderForm formik={formik} />
          <div className='flex mt-2 gap-2 '>
            <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
              Add Entry
            </Button>
            <Button variant='solid' color='blue' onClick={formik.handleSubmit}>
              Save Entries
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddPurchaseOrderForm;
