import moment from "moment";
import { CreateReservation, CreateReservationModel, ExtraModel, ReservationExtraModel, ReservationGuestBaseModel, ReservationGuestModel, ReservationModel, UpdateReservation } from "./reservation.models";
import { Utility } from "genesis-coreservice";

export abstract class ReservationMapper {
    public static CreateReservationMap(x: ReservationModel): CreateReservation {
        let model = <CreateReservation>{
            adult: x.adult,
            child: x.child,
            infant: x.infant,
            guests: x.guests.map(g => ReservationMapper.GuestMap(g)),
            bookings: [this.CreateReservationModelMap(x)]
        }
        return model;
    }

    public static GuestMap(x: ReservationGuestModel): ReservationGuestBaseModel {
        return <ReservationGuestBaseModel>{
            id: x.id,
            title: x.title,
            guestType: x.guestType,
            firstName: x.firstName,
            lastName: x.lastName,
            phoneAreaCode: x.phoneAreaCode,
            phoneNumber: x.phoneNumber,
            email: x.email,
            birthDate: x.birthDate,
            transferOrder: x.transferOrder,
            idOrPassportNo: x.idOrPassportNo,
            nationality: x.nationality,
            isLead: x.isLead
        };
    }

    public static GuestBaseModelMap(x: ReservationGuestBaseModel | undefined): ReservationGuestBaseModel {
        return <ReservationGuestBaseModel>{
            title: x?.title,
            guestType: x?.guestType,
            firstName: x?.firstName,
            lastName: x?.lastName,
            phoneAreaCode: x?.phoneAreaCode,
            phoneNumber: x?.phoneNumber,
            email: x?.email,
            birthDate: x?.birthDate,
            transferOrder: x?.transferOrder,
            idOrPassportNo: x?.idOrPassportNo,
            nationality: x?.nationality
        };
    }

    public static CreateReservationModelMap(x: ReservationModel): CreateReservationModel {
        return <CreateReservationModel>{
            oprVoucher: x.oprVoucher,
            subVoucher: x.subVoucher,
            externalProvider: x.externalProvider,
            operatorId: x.operator?.id,
            transferDate: x.transferDate,
            saleDate: x.saleDate,
            bookingType: x.bookingType,
            transferRouteType: x.transferRouteType,
            transferTypeId: x.transferType?.id,
            vehicleTypeId: x.vehicleType?.id,
            flightCode: x.flight?.code,
            flightDate: x.flight?.flightDate,
            departureTime: x.flight?.departureTime,
            arrivalTime: x.flight?.arrivalTime,
            terminalCode: x.flight?.terminal?.id,
            fromLocation: x.fromLocation,
            toLocation: x.toLocation,
            purchaseAmount: x.purchaseAmount,
            saleAmount: x.saleAmount,
            currency: x.currency,
            pickupTime: x.pickupTime,
            reservationExtras: x.reservationExtras?.map(extra => extra.extraId)
        };
    }

    public static UpdateReservationMap(y: CreateReservation): UpdateReservation {
        let x: CreateReservationModel = y.bookings[0];
        var model = <UpdateReservation>{
            adult: y.adult,
            child: y.child,
            infant: y.infant,
            operatorId: x.operatorId,
            transferRouteType: x.transferRouteType,
            transferDate: Utility.ToDateOnlyFormat(x.transferDate),
            oprVoucher: x.oprVoucher,
            fromLocation: x.fromLocation,
            toLocation: x.toLocation,
            transferTypeId: x.transferTypeId,
            saleDate: Utility.ToDateOnlyFormat(x.saleDate!),
            externalProvider: x.externalProvider,
            bookingType: x.bookingType,
            currency: x.currency,
            purchaseAmount: x.purchaseAmount,
            saleAmount: x.saleAmount,
            reservationExtras: x.reservationExtras,
            flightCode: x.flightCode,
            flightDate: x.flightDate,
            arrivalTime: x.arrivalTime ? Utility.parseTime(x.arrivalTime) : null,
            departureTime: x.departureTime ? Utility.parseTime(x.departureTime) : null,
            terminalCode: x.terminalCode,
            pickupTime: x.pickupTime,
            guests: y.guests
        };
        return model;
    }

    public static ReservationExtraModelMap(x: ExtraModel, oprVoucher: string) : ReservationExtraModel{
        return <ReservationExtraModel>{
            extraId: x.extraId,
            name: x.name,
            operator: x.operator,
            operatorId: x.operatorId,
            tag: x.tag,
            currency: x.currency,
            purchaseAmount: x.purchaseAmount,
            saleAmount: x.saleAmount,
            description: x.description,
            amountType: x.amountType,
            operatorVoucher: oprVoucher
        }
    }
}