
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { GroupingInfo, LoadOptions } from "./load-options.model";
import { Injectable } from '@angular/core';
import { CoreService } from 'genesis-coreservice';

@Injectable()
export class DataSourceBuilder {
    store: any = {
        
    };
    cache: boolean = false;
    constructor(private coreService: CoreService) { }

    loadMode(mode: string): DataSourceBuilder {
        this.store.loadMode = mode;
        return this;
    }
    
    setKey(key: string): DataSourceBuilder {
        this.store.key = key;
        return this;
    }
    setArrayKey(key: Array<string>): DataSourceBuilder {
        this.store.key = key;
        return this;
    }
    isCache(cache?: boolean): DataSourceBuilder {
        if (cache === undefined) {
            this.cache = true;
        } else {
            this.cache = cache;
        }
        return this;
    }

    filter(a: any): DataSourceBuilder {
        let me = this;
        me.store.filter = function (a: any) {

        };
        return me;
    }

    load(message: string, extraParam?: any): DataSourceBuilder {
        let me = this;
        me.store.load = async (loadOptions: any) => {
            let request: any = new LoadOptions(loadOptions);
            if (extraParam !== undefined) {
                let keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach((element: any) => {
                    request[element] = extraParam[element]
                });
            }
            const data = await me.coreService.getCall(message, request);
            return data;
        };
        return me;
    }

    group(field: string): DataSourceBuilder {
        let me = this;
        me.store.group = field;
        return me;
    }

    loadDatas(message: string, extraParam?: any): DataSourceBuilder {
        let me = this;
        me.store.load = async function (loadOptions: any) {
            const data = await me.coreService.getCall(message, extraParam);
            return data;
        };
        return me;
    }

    loadCustom(message: string, extraParam?: any): DataSourceBuilder {
        let me = this;
        me.store.load = async function (loadOptions: any) {
            let request: any = new LoadOptions(loadOptions);
            if (extraParam !== undefined) {
                let keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach(element => {
                    request[element] = extraParam[element]
                });
            }
            const data = await me.coreService.getCall(message, request);
            data['filter'] = function () { };
            return data;
        };
        return me;
    }

    loadCustomData(data: any): DataSourceBuilder {
        let me = this;
        me.store.load = (loadOptions: any) => {
            return new Promise((resolve, reject) => {
                var model = {
                    data: data,
                    groupCount: 0,
                    totalCount: data.length
                };
                resolve(model);
            });

        }
        return me;
    }

    loadParams(params: any): DataSourceBuilder {
        this.store.loadParams = params;
        return this;
    }

    insert(message: string, extraParam?: any): DataSourceBuilder {
        var me = this;
        me.store.insert = (values: any) => {
            if (extraParam !== undefined) {
                var keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach(element => {
                    values[element] = extraParam[element]
                });
            }
            return me.coreService.postCall(message, values);
        };
        return me;
    }
    update(message: string, keyPropName?: string, extraParam?: any): DataSourceBuilder {
        var me = this;
        me.store.update = (key: any, values: any) => {
            let put = message + "/" + key;
            var myJSON = JSON.stringify(values);
            let request: any = {
                values: myJSON
            };
            if (extraParam !== undefined) {
                var keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach(element => {
                    request[element] = extraParam[element]
                });
            }

            if (!keyPropName) {
                keyPropName = keyPropName ?? '';
                request[keyPropName] = key;
            }
            return me.coreService.putCall(put, request);
        };
        return me;
    }
    updateWithoutKey(message: string, extraParam?: any): DataSourceBuilder {
        var me = this;
        me.store.update = (key: any, values: any) => {
            var request = (<any>Object).assign({}, key, values);
            if (extraParam !== undefined) {
                var keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach(element => {
                    request[element] = extraParam[element]
                });
            }

            return me.coreService.putCall(message, request);
        };
        return me;
    }
    updateFullModel(message: string, keyPropName?: string, extraParam?: any): DataSourceBuilder {
        var me = this;
        me.store.update = (key: any, values: any) => {
            let put = message;
            if (typeof key === 'object') {
                var keys = Object.getOwnPropertyNames(key).sort();
                if (keys.length > 0) {
                    keys.forEach(element => {
                        var value = key[element];
                        put += `/${value}`;
                    });
                }
            } else {
                put = put + "/" + key;
            }
            var request = values;
            if (extraParam !== undefined) {
                var keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach(element => {
                    request[element] = extraParam[element]
                });
            }
            if (keyPropName !== undefined) {
                request[keyPropName] = key;
            }
            return me.coreService.putCall(put, request);
        };
        return me;
    }
    updateWithoutGify(message: string, keyPropName?: string): DataSourceBuilder {
        var me = this;
        me.store.update = (key: any, values: any) => {
            let put = message + "/" + key;
            if (keyPropName !== undefined) {
                values[keyPropName] = key;
            }
            return me.coreService.putCall(put, values);
        };
        return me;
    }
    remove(message: string): DataSourceBuilder {
        var me = this;
        me.store.remove = (key: any) => {
            var del = message;
            if (typeof key === 'object') {
                var keys = Object.getOwnPropertyNames(key).sort();
                if (keys.length > 0) {
                    keys.forEach(element => {
                        var value = key[element];
                        del += `/${value}`;
                    });
                }
            } else {
                del += "/" + key;
            }
            return me.coreService.deleteCall(del);
        };
        return me;
    }
    removeExtraParam(message: string, extraParam?: any): DataSourceBuilder {
        var me = this;
        me.store.remove = (key: any) => {
            var del = message + "/" + key;
            let request: any = {};
            if (extraParam !== undefined) {
                var keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach(element => {
                    request[element] = extraParam[element]
                });
                return me.coreService.deleteCall(del, request);
            }
            return me.coreService.deleteCall(del);
        };
        return me;
    }
    byKey(message: string, extraParam?: any, includeProps?: string[]): DataSourceBuilder {
        var me = this;
        me.store.byKey = (key: any) => {
            let request: any = {};
            let keyValue = '';
            if (typeof key === 'object') {
                var values = Object.values(key);
                var properties = Object.getOwnPropertyNames(key).sort();
                for (let i = 0; i < values.length; i++) {
                    var property = properties[i];
                    var existProp = includeProps?.includes(property);
                    if (existProp) {
                        let value = values[i];
                        keyValue += `/${value}`;
                    }
                }
            } else {
                keyValue = `/${key}`;
            }
            if (extraParam !== undefined) {
                var keys = Object.getOwnPropertyNames(extraParam);
                keys.forEach(element => {
                    request[element] = extraParam[element]
                });
            }
            var path = `${message}${keyValue}`;
            return me.coreService.getCall(path, request);
        };
        return me;
    }
    byKeyQuery(message: string): DataSourceBuilder {
        var me = this;
        me.store.byKey = (key: any) => {
            return me.coreService.getCall(message, key);
        };
        return me;
    }
    build = () => {
        return new CustomStore(this.store);
    }

    buildWithFilter(filter?: any) {
        let ds = new DataSource({
            loadMode: 'raw',
            paginate: true,
            store: new CustomStore(this.store),
            filter: filter,
        });
        return ds;
    }
    buildSource(groupField: GroupingInfo[], pageSize?: number) {
        let ds = new DataSource({
            loadMode: 'raw',
            pageSize: pageSize || 10,
            paginate: true,
            group: JSON.stringify(groupField),
            store: new CustomStore(this.store),
        });
        return ds;
    }
}
