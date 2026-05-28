import { GenesisNavigationItem } from "../../@genesis/components/navigation/navigation.types";

export interface Navigation {
    compact: GenesisNavigationItem[];
    default: GenesisNavigationItem[];
    futuristic: GenesisNavigationItem[];
    horizontal: GenesisNavigationItem[];
}