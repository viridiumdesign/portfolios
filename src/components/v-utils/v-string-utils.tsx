
import { Table } from "../../micro-apps/inventory-app/inventory-questionnaire";
import labels from "../v-resources/labels.json";
export class StringUtils {

    public static firstLower(text: string): string {
        if (text.length === 0) {
            return text;
        }
        return text[0].toLocaleLowerCase() + text.slice(1);
    }
    /**
     * Returns the plural of an English word.
     *
     * @export
     * @param {string} word
     * @param {number} [amount]
     * @returns {string}
     */
    public static plural(word: string, amount?: number): string {
        if (amount !== undefined && amount === 1) {
            return word
        }
        const plural: { [key: string]: string } = {
            '(quiz)$': "$1zes",
            '^(ox)$': "$1en",
            '([m|l])ouse$': "$1ice",
            '(matr|vert|ind)ix|ex$': "$1ices",
            '(x|ch|ss|sh)$': "$1es",
            '([^aeiouy]|qu)y$': "$1ies",
            '(hive)$': "$1s",
            '(?:([^f])fe|([lr])f)$': "$1$2ves",
            '(shea|lea|loa|thie)f$': "$1ves",
            'sis$': "ses",
            '([ti])um$': "$1a",
            '(tomat|potat|ech|her|vet)o$': "$1oes",
            '(bu)s$': "$1ses",
            '(alias)$': "$1es",
            '(octop)us$': "$1i",
            '(ax|test)is$': "$1es",
            '(us)$': "$1es",
            '([^s]+)$': "$1s"
        }
        const irregular: { [key: string]: string } = {
            'move': 'moves',
            'foot': 'feet',
            'goose': 'geese',
            'sex': 'sexes',
            'child': 'children',
            'man': 'men',
            'tooth': 'teeth',
            'person': 'people'
        }
        const uncountable: string[] = [
            'sheep',
            'inventory',
            'fish',
            'deer',
            'moose',
            'series',
            'species',
            'money',
            'rice',
            'information',
            'equipment',
            'bison',
            'cod',
            'offspring',
            'pike',
            'salmon',
            'shrimp',
            'swine',
            'trout',
            'aircraft',
            'hovercraft',
            'spacecraft',
            'sugar',
            'tuna',
            'you',
            'wood'
        ]
        // save some time in the case that singular and plural are the same
        if (uncountable.indexOf(word.toLowerCase()) >= 0) {
            return word
        }
        // check for irregular forms
        for (const w in irregular) {
            const pattern = new RegExp(`${w}$`, 'i')
            const replace = irregular[w]
            if (pattern.test(word)) {
                return word.replace(pattern, replace)
            }
        }
        // check for matches using regular expressions
        for (const reg in plural) {
            const pattern = new RegExp(reg, 'i')
            if (pattern.test(word)) {
                return word.replace(pattern, plural[reg])
            }
        }
        return word
    }

    public static t(name: string | undefined): string | undefined {
        if (!name) {
            return name;
        }
        let label = labels.find((l: any) => l.name === name);
        return label ? label.label : StringUtils.toLabel(name);
    }

    public static toLabel = (name: string | undefined): string | undefined => {
        if (!name) {
            return name;
        }
        if (name.replace) {
            const result = name.replace(/([A-Z])/g, " $1");//name.replace(/([A-Z])/, " $1").trim();
            const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
            return finalResult;
        }
        return name;
    }

    public static enumValues = (enumType: any) => {
        let values = Object.values(enumType);
        return values.filter((item: any) => {
            return isNaN(Number(item));
        });
    }

    public static enumOptions = (enumType: any) => {
        return this.enumValues(enumType).map((v: any) => {
            return { name: v, label: v, value: v }
        });
    }

    public static tableToJson = (table: any) => {
        let trs = Array.from(document.getElementsByTagName("tr"));
        let rows = [];
        for (let row of trs) {

            let cols = Array.from(row.getElementsByTagName("td"));
            let col = [];
            for (let c of cols) {
                col.push(c.innerText);
            }
            if (col.length > 0)
                rows.push(col);
        }
        let ths = Array.from(document.getElementsByTagName("th"));
        let header = []
        for (let h of ths) {
            header.push(h.innerText);
        }
        return { header, rows };
    }

    static guid(length: number = 8): string {
        return crypto.randomUUID().slice(0, length);
    }

    static loadContent = async (url: string): Promise<string> => {
        return fetch(url).then((response) => {
            if (response.status !== 200) {
                console.debug('Looks like there was a problem. Status Code: ' + response.status);
                throw Error("Failed to load content at " + url + ` [${response.status}]`);
            }
            return response.text();
        })
    }

    static getUnique = (c8: Array<string>) => {
        let uniqs: Array<string> = [];
        c8.forEach((c) => {
            if (!uniqs.includes(c)) {
                uniqs.push(c);
            }
        })
        return uniqs;
    }

    static loadJson = async (url: string): Promise<any> => {
        return fetch(url).then((response) => {
            if (response.status !== 200) {
                console.debug('Looks like there was a problem. Status Code: ' + response.status);
                throw Error("Failed to load content at " + url + ` [${response.status}]`);
            }
            return response.json();
        })
    }

    static download = (text: string, name: string, type: string) => {
        console.log("downloading " + name);
        var a = document.createElement("a");
        var file = new Blob([text], { type: type });
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }
}

export class ExcelUtils {
    uri = 'data:application/vnd.ms-excel;base64,';

    tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
        + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
        + '<Styles>'
        + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
        + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
        + '</Styles>'
        + '{worksheets}</Workbook>';
    tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>';
    tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>';
    base64 = (s: any) => { return window.btoa(unescape(encodeURIComponent(s))) };

    format = (s: any, c: any) => { return s.replace(/{(\w+)}/g, (m: any, p: any) => { return c[p]; }) };
    fromTables = (tables: Array<any>, wsNames: Array<string>, appName: string) => {
        let ctx: any = {};
        let workbookXML = "";
        let worksheetsXML = "";
        let rowsXML = "";

        for (let i = 0; i < tables.length; i++) {
            if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
            for (let j = 0; j < tables[i].rows.length; j++) {
                rowsXML += '<Row>'
                for (let k = 0; k < tables[i].rows[j].cells.length; k++) {
                    let dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                    let dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                    let dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                    dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML;
                    let dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                    dataFormula = (dataFormula) ? dataFormula : (appName === 'Calc' && dataType === 'DateTime') ? dataValue : null;
                    ctx = {
                        attributeStyleID: (dataStyle === 'Currency' || dataStyle === 'Date') ? ' ss:StyleID="' + dataStyle + '"' : ''
                        , nameType: (dataType === 'Number' || dataType === 'DateTime' || dataType === 'Boolean' || dataType === 'Error') ? dataType : 'String'
                        , data: (dataFormula) ? '' : dataValue
                        , attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                    };
                    rowsXML += this.format(this.tmplCellXML, ctx);
                }
                rowsXML += '</Row>'
            }
            ctx = { rows: rowsXML, nameWS: wsNames[i] || 'Sheet' + i };
            worksheetsXML += this.format(this.tmplWorksheetXML, ctx);
            rowsXML = "";
        }

        ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
        workbookXML = this.format(this.tmplWorkbookXML, ctx);
        return this.base64(workbookXML);


        //   var link = document.createElement("a");
        //   link.href = uri + this.base64(workbookXML);
        //   link.download = wbname || 'Workbook.xls';
        //   link.target = '_blank';
        //   document.body.appendChild(link);
        //   link.click();
        //   document.body.removeChild(link);
    }
    /**
     * 
     * @param tables table.row[i].col[j]
     * @param wsNames 
     * @param appName 
     * @returns formatted xml can be downloaded
     */
    fromData = (tables: Array<Table>) => {
        let ctx: any = {};
        let worksheetsXML = "";
        let rowsXML = "";
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            for (let j = 0; j < table.rows.length; j++) {
                rowsXML += '<Row>'
                for (let k = 0; k < table.rows[j].cols.length; k++) {
                    let cell = table.rows[j].cols[k];
                    let dataType = typeof cell;
                    let dataStyle = "";
                    let dataValue = cell;
                    let dataFormula = null;
                    ctx = {
                        attributeStyleID: (dataStyle === 'Currency' || dataStyle === 'Date') ? ' ss:StyleID="' + dataStyle + '"' : ''
                        , nameType: (dataType === 'number' || dataType === 'string' || dataType === 'boolean') ? dataType : 'String'
                        , data: (dataFormula) ? '' : dataValue
                        , attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                    };
                    rowsXML += this.format(this.tmplCellXML, ctx);
                }
                rowsXML += '</Row>'
            }
            ctx = { rows: rowsXML, nameWS: table.name || 'Sheet' + i };
            worksheetsXML += this.format(this.tmplWorksheetXML, ctx);
            rowsXML = "";
        }
        ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
        let workbookXML = this.format(this.tmplWorkbookXML, ctx);
        return workbookXML;
    }
}