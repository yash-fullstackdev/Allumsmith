import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import Button from "../../../../components/ui/Button";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody } from "../../../../components/ui/Card";
import { PathRoutes } from "../../../../utils/routes/enum";
import Label from "../../../../components/form/Label";
import { post } from "../../../../utils/api-helper.util";
import { useState } from "react";
import { toast } from "react-toastify";
import { Switch } from "@mui/material";
import { useFormik } from 'formik';
import ColorForm from "../../../../components/PageComponets/ColorForm/ColorForm";
import { colorsSchema } from "../../../../utils/formValidations";

const ColorsPage = () => {
    const navigate = useNavigate();
    const formik: any = useFormik({
        initialValues: {
            entries: [{ name: '', code: '' }],
            type: "coating"
        },
        validationSchema: colorsSchema,
        onSubmit: async (values) => {
            try {
                const promises = values.entries.map(async (entry: any) => {
                    const { data } = await post("/colors", { ...entry, type: values?.type });
                    return data;
                });
                const results = await Promise.all(promises);
                toast.success("Colors added Successfully!");
                navigate(PathRoutes.colors);
            } catch (error: any) {
                console.error("Error Adding Color", error);
                toast.error("Error Adding Colors", error);
            }
        },
    });

    const handleAddEntry = () => {
        formik.setFieldValue('entries', [...formik.values.entries, { name: '', code: '' }]);
    };

    return (
        <PageWrapper name='ADD Colors' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.colors}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <Card className="m-5">
                    <CardBody>
                        <div
                            className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                        >
                            Add Color
                        </div>
                        <ColorForm formik={formik} />
                        <div className='flex mt-2 gap-2'>
                            <Button variant='solid' color='blue' type='button' icon='HeroPlus' onClick={handleAddEntry}>
                                Add Entry
                            </Button>
                            <Button variant='solid' color='blue' onClick={formik.handleSubmit}>
                                Save Entries
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default ColorsPage;
