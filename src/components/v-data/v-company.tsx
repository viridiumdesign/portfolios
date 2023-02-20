
import { Component } from "react";
import { StringUtils } from "../v-utils/v-string-utils";
import { StandardProps } from "../v-common/v-types";
import { FieldDef } from "../v-entity/entity-form";
import { metadataManager } from "../v-entity/entity-model";
import { Select } from "../v-select/v-select";
import { metadataService } from "./data-service";


interface CompanyProps extends StandardProps {
    onSelect: Function
    def?: FieldDef,
    entity?: FieldDef
}

interface CompanyState {
    selected: any
}

export class SelectCompany extends Component<CompanyProps, CompanyState> {
    constructor(props: CompanyProps) {
        super(props);
        this.state = { selected: undefined };
    }

    onChange = (evt: any) => {
        const selectedSymbol = evt.value;
        metadataService.getCompanyDetails(selectedSymbol).then((company) => {
            this.setState({ selected: company });
            this.props.onSelect({ ...evt, def: this.props.def, value: selectedSymbol }, company);
        })
    }

    getCompanies = (): Array<{ value: string, label: string }> => {
        return metadataManager.getCompanies1();
    }

    render = () => {
        return <div className="v-select-company" id={this.props.id ? this.props.id : StringUtils.guid()}>
            <Select placeholder={StringUtils.t("company")} options={this.getCompanies()}
                onChange={this.onChange} value={this.state.selected?.value} />
        </div>
    };
}