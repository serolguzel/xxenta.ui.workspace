import { PaymentType } from "./company.models";

export abstract class ModelMapper {
    public static GetPaymentTypeName(p: PaymentType) {
        switch(p){
            case PaymentType.None:
                return "None";
            case PaymentType.PerMonth:
                return "Montly";
            case PaymentType.PerYear:
                return "Yearly";
            default:
                return "None";
        }
    }
}