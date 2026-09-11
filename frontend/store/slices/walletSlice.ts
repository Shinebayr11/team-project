import { StoreState } from '../../types';
import { StateUpdater, WalletSlice } from '../types';
import { makeId } from '../state';

/**
 * `LiveShow` дээрх demo reel-үүдэд `productId` байдаггүй тул сервер рүү
 * захиалга явуулах боломжгүй — тэдгээрийн үр дүнг зөвхөн локал жагсаалтад
 * тэмдэглэнэ. Үлдэгдлийг ЭНД хасахгүй: зарцуулах чадварыг дуудагч тал
 * бодит хэтэвчээс (`useWallet`) шалгана.
 */
export const createWalletSlice = (_state: StoreState, update: StateUpdater): WalletSlice => ({
  buy: ({ title, seller, price, qty }) => {
    update(s => ({
      ...s,
      purchases: [
        { id: makeId('buy_'), title, seller, price, qty, date: 'Just now', status: 'processing' },
        ...s.purchases,
      ],
    }));
  },

  bid: ({ title, seller, amount }) => {
    update(s => ({
      ...s,
      bids: [
        { id: makeId('bid_'), title, seller, amount, date: 'Just now', status: 'leading' },
        ...s.bids.filter(b => b.title !== title || b.seller !== seller),
      ],
    }));
  },
});
