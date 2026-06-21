import { UserLookupModel } from "genesis-coreservice";

export interface MostSeller {
    seller: UserLookupModel;
    pax: number | null;
    total: number | null;
}
