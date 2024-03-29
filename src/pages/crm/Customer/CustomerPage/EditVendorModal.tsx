import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, put } from "../../../../utils/api-helper.util";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import Checkbox from "../../../../components/form/Checkbox";
import { toast } from "react-toastify";

const EditCustomerModal = ({ customerId, setIsEditModal, fetchData }: any) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    gst_number: '',
    company: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zipcode: '',
    default_discount: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchCustomerById = async () => {
    try {
      const customer = await get(`/customers/${customerId}`);
      const { name, email, phone, gst_number, company, address_line1, address_line2, city, state, zipcode, default_discount } = customer.data;
      setFormData({ name, email, phone, gst_number, company, address_line1, address_line2, city, state, zipcode, default_discount });
    } catch (error) {
      console.error("Error fetching Customer data:", error);
    }
  }

  useEffect(() => {
    fetchCustomerById();
  }, []);

  const editCustomer = async () => {
    console.log("entries", formData);
    try {
      const editedCustomer = await put(`/customers/${customerId}`, formData);
      console.log("edited customer", editedCustomer)
      toast.success("Cusomer edited Successfully!")
    } catch (error: any) {
      console.error("Error Updating Customer", error);
      toast.error('Error Updating Customer', error)
    }
    finally {
      // navigate(PathRoutes.vendor);
      setIsEditModal(false);
      fetchData();
    }
  };

  return (
    <PageWrapper name='Edit Customer' isProtectedRoute={true}>
      <Container className='flex shrink-0 grow basis-auto flex-col '>
        <Card>
          <CardBody>
            <div className='mt-1 grid grid-cols-12 gap-2'>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='name'>
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='email'>
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='phone'>
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='gst_number'>
                  GST Number
                </Label>
                <Input
                  id="gst_number"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='company'>
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='address_line1'>
                  Address Line 1
                </Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='address_line2'>Address Line 2</Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='city'>
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='state'>
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='zipcode'>
                  Zipcode
                </Label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='default_discount'>
                  Discount (%)
                </Label>
                <Input
                  id="default_discount"
                  name="default_discount"
                  value={formData.default_discount}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className='flex mt-4 gap-2'>
              <Button variant='solid' color='blue' type='button' onClick={editCustomer}>
                Update Customer
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper >
  );
};

export default EditCustomerModal;
