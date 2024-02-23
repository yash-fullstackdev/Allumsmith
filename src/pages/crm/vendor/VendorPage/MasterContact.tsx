import Input from "../../../../components/form/Input"
import Label from "../../../../components/form/Label"
import Textarea from "../../../../components/form/Textarea"
import Button from "../../../../components/ui/Button"
import Card, { CardBody } from "../../../../components/ui/Card"
import Collapse from "../../../../components/utils/Collapse"
import getUserRights from "../../../../hooks/useUserRights"
import { handleInputChange } from "../../../../utils/capitalizedFunction.util"

const MasterContact = ({ formik, accordionStates, setAccordionStates }: any) => {
    const privileges = getUserRights('vendors');

    return (
        <Card>
            <CardBody>
                <div className="flex">
                    <div className="bold w-full">
                        <Button
                            variant="outlined"
                            className="flex w-full items-center justify-between rounded-none border-b text-lg font-bold text-start px-[2px] py-[0px]"
                            onClick={() => setAccordionStates({ ...accordionStates, MCI: !accordionStates.MCI })}
                            rightIcon={!accordionStates.MCI ? 'HeroChevronUp' : 'HeroChevronDown'}>
                            Master Contact Information
                        </Button>
                    </div>
                </div>
                <Collapse isOpen={!accordionStates.MCI}>
                    <div className="grid grid-cols 12 gap-4 mt-4">
                        <div className="col-span-12 lg:col-span-6">
                            <Label htmlFor="masterContact">
                                Master Contact
                            </Label>
                            <Input
                                id="masterContact"
                                name="masterContact"
                                onChange={handleInputChange(formik.setFieldValue)('masterContact')}
                                value={formik.values.masterContact}
                                onBlur={formik.handleBlur}
                                disabled={!privileges.canWrite()}
                            />
                            {formik.touched.masterContact && formik.errors.masterContact ? (
                                <div className="text-red-500">
                                    {formik.errors.masterContact}
                                </div>
                            ) : null}
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <Label htmlFor="masterContactEmail">
                                Master Contact Email
                            </Label>
                            <Input
                                id="masterContactEmail"
                                name="masterContactEmail"
                                onChange={handleInputChange(formik.setFieldValue)('masterContactEmail')}
                                value={formik.values.masterContactEmail}
                                onBlur={formik.handleBlur}
                                disabled={!privileges.canWrite()}
                            />
                            {formik.touched.masterContactEmail && formik.errors.masterContactEmail ? (
                                <div className="text-red-500">
                                    {formik.errors.masterContactEmail}
                                </div>
                            ) : null}
                        </div>
                        <div className="col-span-12 lg:col-span-12">
                            <Label htmlFor="masterContactNotes">
                                Master Contact Notes
                            </Label>
                            <Textarea
                                id="masterContactNotes"
                                name="masterContactNotes"
                                onChange={handleInputChange(formik.setFieldValue)('masterContactNotes')}
                                value={formik.values.masterContactNotes}
                                onBlur={formik.onBlur}
                                disabled={!privileges.canWrite()}
                            />
                        </div>
                    </div>
                </Collapse>
            </CardBody>
        </Card>
    )
}

export default MasterContact
