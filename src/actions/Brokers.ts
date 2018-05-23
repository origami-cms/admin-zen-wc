import {APIActions} from 'origami-zen';
import API from 'lib/API';

export const {
    brokersCreate,
    brokersGet,
    brokersUpdate,
    brokersRemove
} = APIActions('brokers', API);
