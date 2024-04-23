// import { useNavigate } from "react-router-dom";
// import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
// import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
// import Button from "../../../../components/ui/Button";
// import Container from "../../../../components/layouts/Container/Container";
// import Card, { CardBody } from "../../../../components/ui/Card";
// import { PathRoutes } from "../../../../utils/routes/enum";
// import Label from "../../../../components/form/Label";
// import Input from "../../../../components/form/Input";
// import { post } from "../../../../utils/api-helper.util";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { Switch } from "@mui/material";

// const ColorsPage = () => {
//     const navigate = useNavigate();
//     const [entries, setEntries] = useState([{ name: '', code: '' }]);
//     const [colorState, setColorState] = useState<boolean>(false);
//     const handleAddEntry = () => {
//         setEntries([...entries, { name: '', code: '' }]);
//     };

//     const handleSaveEntries = async (type: string) => {
//         try {
//             const promises = entries.map(async (entry) => {
//                 const { data } = await post("/colors", { ...entry, type });
//                 return data;
//             });
//             const results = await Promise.all(promises);
//             toast.success("Colors added Successfully!");
//             navigate(PathRoutes.colors);
//         } catch (error: any) {
//             console.error("Error Adding Color", error);
//             toast.error("Error Adding Colors", error);
//         }
//     };

//     const handleDeleteColor = (index: any) => {
//         const newProduct = [...entries]
//         newProduct.splice(index, 1)
//         setEntries(newProduct)
//     }

//     return (
//         <PageWrapper name='ADD Colors' isProtectedRoute={true}>
//             <Subheader>
//                 <SubheaderLeft>
//                     <Button
//                         icon='HeroArrowLeft'
//                         className='!px-0'
//                         onClick={() => navigate(`${PathRoutes.colors}`)}
//                     >
//                         {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
//                     </Button>

//                     <div className='flex items-center justify-center ml-4' >
//                         <h4>Coating</h4>  <Switch {...Label} checked={colorState} onClick={() => setColorState(!colorState)} /><h4>Anodize</h4>
//                     </div>
//                     <SubheaderSeparator />
//                 </SubheaderLeft>

//             </Subheader>
//             <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
//                 <div className='flex h-full flex-wrap content-start'>
//                     <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
//                         <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
//                             <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
//                                 <Card>
//                                     <CardBody>
//                                         <div className='flex'>
//                                             <div className='bold w-full'>
//                                                 <Button
//                                                     variant='outlined'
//                                                     className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'

//                                                 >
//                                                     Add Color
//                                                 </Button>
//                                             </div>
//                                         </div>

//                                         {entries.map((entry, index) => (
//                                             <>
//                                                 <div className='flex items-end justify-end mt-2'>
//                                                     {entries.length > 1 && (
//                                                         <div className='flex items-end justify-end'>
//                                                             <Button
//                                                                 type='button'
//                                                                 onClick={() => handleDeleteColor(index)}
//                                                                 variant='outlined'
//                                                                 color='red'
//                                                             // isDisable={!privileges.canWrite()}
//                                                             >
//                                                                 <svg
//                                                                     xmlns='http://www.w3.org/2000/svg'
//                                                                     fill='none'
//                                                                     viewBox='0 0 24 24'
//                                                                     strokeWidth='1.5'
//                                                                     stroke='currentColor'
//                                                                     data-slot='icon'
//                                                                     className='h-6 w-6'>
//                                                                     <path
//                                                                         strokeLinecap='round'
//                                                                         strokeLinejoin='round'
//                                                                         d='M6 18 18 6M6 6l12 12'
//                                                                     />
//                                                                 </svg>
//                                                             </Button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div key={index} className='mt-2 grid grid-cols-12 gap-1'>

//                                                     <div className='col-span-12 lg:col-span-4'>
//                                                         <Label htmlFor={`name-${index}`}>
//                                                             Name
//                                                         </Label>
//                                                         <Input
//                                                             id={`name-${index}`}
//                                                             name={`name-${index}`}
//                                                             value={entry.name}
//                                                             onChange={(e) => {
//                                                                 const updatedEntries = [...entries];
//                                                                 updatedEntries[index].name = e.target.value;
//                                                                 setEntries(updatedEntries);
//                                                             }}
//                                                         />
//                                                         {/* ... Error handling for name field */}
//                                                     </div>
//                                                     <div className='col-span-12 lg:col-span-4'>
//                                                         <Label htmlFor={`code-${index}`}>
//                                                             Code
//                                                         </Label>
//                                                         <Input
//                                                             id={`code-${index}`}
//                                                             name={`code-${index}`}
//                                                             value={entry.code}
//                                                             type="number"
//                                                             onChange={(e) => {
//                                                                 const updatedEntries = [...entries];
//                                                                 updatedEntries[index].code = e.target.value;
//                                                                 setEntries(updatedEntries);
//                                                             }}
//                                                         />
//                                                         {/* ... Error handling for hsn field */}
//                                                     </div>

//                                                 </div>
//                                             </>
//                                         ))}
//                                         <div className='flex mt-2 gap-2'>
//                                             <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
//                                                 Add Entry
//                                             </Button>

//                                             <Button variant='solid' color='blue' type='button' onClick={() => handleSaveEntries(colorState ? 'anodize' : 'coating')}>
//                                                 Save Entries
//                                             </Button>
//                                         </div>
//                                     </CardBody>
//                                 </Card>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Container>
//         </PageWrapper>
//     );
// };

// export default ColorsPage;

import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import Button from "../../../../components/ui/Button";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody } from "../../../../components/ui/Card";
import { PathRoutes } from "../../../../utils/routes/enum";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import { post } from "../../../../utils/api-helper.util";
import { useState } from "react";
import { toast } from "react-toastify";
import { Switch } from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    entries: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Name is required'),
            code: Yup.string().required('Code is required'),
        })
    ),
});

const ColorsPage = () => {
    const navigate = useNavigate();
    const [colorState, setColorState] = useState<boolean>(false);

    const formik: any = useFormik({
        initialValues: {
            entries: [{ name: '', code: '' }]
        },
        validationSchema,
        onSubmit: () => { }
    });

    const handleAddEntry = () => {
        formik.setFieldValue('entries', [...formik.values.entries, { name: '', code: '' }]);
    };

    const handleDeleteColor = (index: number) => {
        const newEntries = [...formik.values.entries];
        newEntries.splice(index, 1);
        formik.setFieldValue('entries', newEntries);
    }
    const handleSaveEntries = async (type: any) => {
        try {
            const promises = formik.values.entries.map(async (entry: any) => {
                const { data } = await post("/colors", { ...entry, type });
                return data;
            });
            const results = await Promise.all(promises);
            toast.success("Colors added Successfully!");
            navigate(PathRoutes.colors);
        } catch (error: any) {
            console.error("Error Adding Color", error);
            toast.error("Error Adding Colors", error);
        }
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

                    <div className='flex items-center justify-center ml-4' >
                        <h4>Coating</h4>  <Switch {...Label} checked={colorState} onClick={() => setColorState(!colorState)} /><h4>Anodize</h4>
                    </div>
                    <SubheaderSeparator />
                </SubheaderLeft>
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                <Card>
                                    <CardBody>
                                        <div className='flex'>
                                            <div className='bold w-full'>
                                                <Button
                                                    variant='outlined'
                                                    className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'

                                                >
                                                    Add Color
                                                </Button>
                                            </div>
                                        </div>
                                        <form onSubmit={formik.handleSubmit}>
                                            {formik.values.entries.map((entry: any, index: any) => (
                                                <div key={index} className='mt-2 grid grid-cols-12 gap-1'>
                                                    <div className='col-span-12 lg:col-span-4'>
                                                        <Label htmlFor={`name-${index}`}>
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id={`name-${index}`}
                                                            name={`entries[${index}].name`}
                                                            value={entry.name}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        {formik.touched.entries && formik.touched.entries[index] && formik.errors.entries && formik.errors.entries[index] && formik.errors.entries[index].name && (
                                                            <div className='text-red-500'>{formik.errors.entries[index].name}</div>
                                                        )}
                                                    </div>
                                                    <div className='col-span-12 lg:col-span-4'>
                                                        <Label htmlFor={`code-${index}`}>
                                                            Code
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            id={`code-${index}`}
                                                            name={`entries[${index}].code`}
                                                            value={entry.code}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        {formik.touched.entries && formik.touched.entries[index] && formik.errors.entries && formik.errors.entries[index] && formik.errors.entries[index].code && (
                                                            <div className='text-red-500'>{formik.errors.entries[index].code}</div>
                                                        )}

                                                    </div>
                                                    <div className='col-span-12 lg:col-span-4 flex items-end justify-end'>
                                                        {formik.values.entries.length > 1 && (
                                                            <Button
                                                                type='button'
                                                                onClick={() => handleDeleteColor(index)}
                                                                variant='outlined'
                                                                color='red'
                                                            >
                                                                <svg
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                    fill='none'
                                                                    viewBox='0 0 24 24'
                                                                    strokeWidth='1.5'
                                                                    stroke='currentColor'
                                                                    data-slot='icon'
                                                                    className='h-6 w-6'>
                                                                    <path
                                                                        strokeLinecap='round'
                                                                        strokeLinejoin='round'
                                                                        d='M6 18 18 6M6 6l12 12'
                                                                    />
                                                                </svg>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className='flex mt-2 gap-2'>
                                                <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
                                                    Add Entry
                                                </Button>
                                                <Button variant='solid' color='blue' onClick={() => handleSaveEntries(colorState ? 'anodize' : 'coating')}>
                                                    Save Entries
                                                </Button>
                                            </div>
                                        </form>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default ColorsPage;
