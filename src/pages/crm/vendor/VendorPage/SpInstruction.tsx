import { useState } from "react"
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Collapse from "../../../../components/utils/Collapse";
import Label from "../../../../components/form/Label";
import Textarea from "../../../../components/form/Textarea";

const SpInstruction = ({ formik, accordionStates, setAccordionStates }: any) => {
    return (
        <Card>
            <CardBody>
                <div className="flex">
                    <div className="bold w-full">
                        <Button
                            variant="outlined"
                            className="flex w-full items-center justify-between rounded-none border-b text-lg font-bold text-start"
                            onClick={() => setAccordionStates({...accordionStates, spInstructions: !accordionStates.spInstructions})}
                            rightIcon={
                                !accordionStates.spInstructions ? 'HeroChevronUp' : 'HeroChevronDown'
                            }>
                            Special Instructions
                        </Button>
                    </div>
                </div>
                <Collapse isOpen={!accordionStates.spInstructions}>
                    <div className="grid grid-cols-12 gap-4 mt-4">
                        <div className="col-span-12">
                            <Label htmlFor="spInstruction">Special Instructions</Label>
                            <Textarea
                                id="spInstruction"
                                name="spInstruction"
                                onChange={formik.handleChange}
                                value={formik.values.spInstruction}
                                onBlur={formik.handleBlur}
                                autoComplete="spInstruction"
                            />
                        </div>
                    </div>
                </Collapse>
            </CardBody>
        </Card>
    )
}

export default SpInstruction
