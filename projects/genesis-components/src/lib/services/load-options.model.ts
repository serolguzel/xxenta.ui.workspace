export class LoadOptions {
    requireTotalCount: boolean;
    requireGroupCount: boolean;
    isCountQuery: boolean;
    skip: number;
    take: number;
    sort: any; //SortingInfo[];
    group: any; //GroupingInfo[];
    filter: any;
    totalSummary: any; // SummaryInfo[];
    groupSummary: any; // SummaryInfo[];
    select: any;
    searchValue?: string | null;
    constructor(item: any) {
        this.requireTotalCount = item.requireTotalCount !== undefined ? item.requireTotalCount : false;
        this.requireGroupCount = item.requireGroupCount !== undefined ? item.requireGroupCount : false;
        this.isCountQuery = item.isCountQuery !== undefined ? item.isCountQuery : false;

        this.skip = parseInt(item.skip) > 0 ? item.skip : 0;
        this.take = parseInt(item.take) > 0 ? item.take : 10;

        this.sort = item.sort !== null ? JSON.stringify(item.sort) : undefined;
        this.group = item.group !== null ? JSON.stringify(item.group) : undefined;
        this.totalSummary = item.totalSummary !== undefined ? JSON.stringify(item.totalSummary) : undefined;
        this.groupSummary = item.groupSummary !== undefined ? JSON.stringify(item.groupSummary) : undefined;
        this.select = item.select !== undefined ? JSON.stringify(item.select) : undefined;

        this.filter = item.filter !== undefined ? JSON.stringify(item.filter) : undefined;
        if (item.searchValue !== null && item.searchValue !== undefined) {
            this.searchValue = item.searchValue;
            this.filter = JSON.stringify(filterGenerate(item));
        } else {
            this.searchValue = getFilterValue(item.filter);
        }
    }
}

export function filterGenerate(item: any): any[] {
    var search = [];
    var isArray = Array.isArray(item.searchExpr);
    if (item.searchExpr.length > 1 && isArray) {
        for (var i = 0; i < item.searchExpr.length; i++) {
            var s = [item.searchExpr[i], item.searchOperation, item.searchValue];
            if (i < item.searchExpr.length - 1) {
                search.push(s);
                search.push('or');
            } else {
                search.push(s);
            }
        }
    } else {
        search = [item.searchExpr, item.searchOperation, item.searchValue];
    }
    return search;
}

export function getFilterValue(data: any): string | null {
    if (data == null)
        return null;
    if (typeof data !== 'object')
        return null;
    var value = '';
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (JSON.stringify(item).includes('contains')) {
                value = item.filterValue;
                break;
            }
        }
    }
    return value;
}

export interface GroupingInfo extends SortingInfo {
    groupInterval: string;
    isExpanded: boolean | null;
}
export interface SortingInfo {
    selector: string;
    desc: boolean;
}