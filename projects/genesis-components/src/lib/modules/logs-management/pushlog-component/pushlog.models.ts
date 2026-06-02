export interface GetPushProcesses {
    filterText: string | null;
    skip: number;
    take: number;
    isSuccess: boolean | null;
    transferDate: string | null;
    code: string | null;
}

export interface PushModel {
    id: string;
    createBy: string;
    createDate: string;
    code: string;
    transferDate: string;
    progressTime: number;
    isSuccess: boolean;
    request: string | null;
    data: string | null;
    messages: string[] | null;
    entity: string;
    application: string;
}