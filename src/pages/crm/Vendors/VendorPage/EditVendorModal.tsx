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

const EditProductModal = ({ vendorId, setIsEditModal, fetchData }: any) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    gstNumber: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipcode: '',
    isArchive: false
  });
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchVendorById = async () => {
    try {
      const vendorData = await get(`/vendors/${vendorId}`);
      const { name, email, phone, gstNumber, company, addressLine1, addressLine2, city, state, zipcode, isArchive } = vendorData.data;
      setFormData({ name, email, phone, gstNumber, company, addressLine1, addressLine2, city, state, zipcode, isArchive });
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  }

  useEffect(() => {
    fetchVendorById();
  }, []);

  const editVendor = async () => {
    console.log("entries", formData);
    try {
      const editedVendor = await put(`/vendors/${vendorId}`, formData);
      console.log("edited Vendor", editedVendor)
    } catch (error: any) {
      console.error("Error Saving Vendor", error)
    }
    finally {
      // navigate(PathRoutes.vendor);
      setIsEditModal(false);
      fetchData();
    }
  };

  return (
    <PageWrapper name='Edit Vendor' isProtectedRoute={true}>
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
                <Label htmlFor='gstNumber'>
                  GST Number
                </Label>
                <Input
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
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
                <Label htmlFor='addressLine1'>
                  Address Line 1
                </Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                />
              </div>
              <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='addressLine2'>Address Line 2</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
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
                <Label htmlFor='isArchive'>Is Archive</Label>
                <Checkbox
                  id="isArchive"
                  name="isArchive"
                  checked={formData.isArchive}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex mt-4 gap-2'>
              <Button variant='solid' color='blue' type='button' onClick={editVendor}>
                Update Vendor
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper >
  );
};

export default EditProductModal;
