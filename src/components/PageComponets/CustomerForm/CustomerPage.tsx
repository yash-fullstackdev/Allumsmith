import React from "react";
import Button from "../../ui/Button";
import Label from "../../form/Label";
import Input from "../../form/Input";

type props = {
  formik: any,
};
const CustomerForm = ({ formik }: props) => {

  return (
    <form onSubmit={formik.handleSubmit}>
   
    </form>
  )
};

export default CustomerForm