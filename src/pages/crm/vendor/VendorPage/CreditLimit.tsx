import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Collapse from "../../../../components/utils/Collapse";
import Label from "../../../../components/form/Label";
import getUserRights from "../../../../hooks/useUserRights";
import FieldWrap from "../../../../components/form/FieldWrap";
import Input from "../../../../components/form/Input";
import Icon from "../../../../components/icon/Icon";



const CreditLimit = ({ formik, accordionStates, setAccordionStates }: any) => {
    const privileges = getUserRights('vendors');
    return (
        <Card>
            <CardBody>
                <div className="flex">
                    <div className="bold w-full">
                        <Button
                            variant="outlined"
                            className="flex w-full items-center justify-between rounded-none border-b text-lg font-bold text-start px-[2px] py-[0px]"
                            onClick={() => setAccordionStates({ ...accordionStates, creditLimit: !accordionStates.creditLimit })}
                            rightIcon={
                                !accordionStates.creditLimit ? 'HeroChevronUp' : 'HeroChevronDown'
                            }>
                            Credit Limit
                        </Button>
                    </div>
                </div>
                <Collapse isOpen={!accordionStates.creditLimit}>
                    <div className="grid grid-cols-12 gap-4 mt-4">
                        <div className="col-span-12 lg:col-span-4">
                            <Label htmlFor="creditLimit">Credit Limit</Label>
                            <FieldWrap
                                firstSuffix={<div className="mx-2">$</div>}>
                                <Input
                                    id="creditLimit"
                                    className="pl-7"
                                    name="creditLimit"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.creditLimit}
                                    onBlur={formik.handleBlur}
                                    disabled={!privileges.canWrite()}

                                />

                            </FieldWrap>

                            {formik.touched.creditLimit && formik.errors.creditLimit ? (
                                <div className='text-red-500'>{formik.errors.creditLimit}</div>
                            ) : null}


                        </div>
                    </div>
                </Collapse>
            </CardBody>
        </Card>
    )
}

export default CreditLimit
