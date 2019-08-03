import {AdInterface} from "../models/ad/AdInterface";
import {FilterModelI} from "../models/filter/FilterModel";

export interface ProviderInterface {
    debugModeOn();
    getNewAds(filter: FilterModelI): Promise<AdInterface[]>;
}
