export interface ReservationNoteModel {
    id: number;
    createDate: string;
    createBy: string;
    updateDate: string;
    updateBy: string;
    isDeleted: boolean;
    reservationId: string;
    note: string;
    voucher: string;
    operatorVoucher: string;
    createUser: TransferBookingNoteUserModel;
}

export interface TransferBookingNoteUserModel {
    id: string;
    username: string;
    displayName: string;
    email: string;
    title: string;
    picture: string;
    departmentId: string;
    company: {
        id: string;
        name: string;
        code: string;
        logos: string[];
    };
    department: {
        id: string;
        name: string;
    };
}