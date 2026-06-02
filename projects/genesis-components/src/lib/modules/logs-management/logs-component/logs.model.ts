export interface LogRequest {
    createDate?: string | null;
    voucher?: string | null;
    source?: string | null;
    message?: string | null;
    host?: string | null;
    path?: string | null;
    correlationId?: string | null;
    loggingType?: string | null;
    skip: number;
    take: number;
}

export interface MailProcessModel {
    id: string;
    createBy: string;
    createDate: string;
    code: string;
    isSent: boolean;
    progressTime: number;
    isSuccess: boolean;
    message: string | null;
    data: string | null;
    body: string;
}

export interface LogModel {
    id: string;
    timestamp: string;
    level: LogLevel;
    loggingType: LoggingType;
    message: string;
    source: string | null;
    userId: string;
    ownerId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    host: string | null;
    path: string | null;
    method: string | null;
    correlationId: string;
    timer: number | null;
    requestBody: any | null;
    responseBody: any | null;
    exception: ExceptionDetailsModel | null;
    status: StatusDetailsModel | null;
    metadata: { [key: string]: any; } | null;
}

export interface ExceptionDetailsModel {
    type: string;
    message: string;
    stackTrace: string;
    innerException: string;
    additionalData: { [key: string]: any; };
}

export interface StatusDetailsModel {
    status: string;
    statusCode: number;
    description: string;
    state: { [key: string]: any; };
}

export enum LogLevel {
    Info,
    Warning,
    Error,
    Debug
}

export enum LoggingType {
    Notlog,
    Request,
    Response,
    RequestResponse,
    Exception,
    Status,
    Performance,
    Progress,
    HttpLogging
}