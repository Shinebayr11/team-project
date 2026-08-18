import { SellerShow, ShowProduct } from '@/features/seller-hub/types';
import { StateUpdater, ShowsSlice } from '@/store/types';
import { makeId } from '@/store/state';

export const createShowsSlice = (update: StateUpdater): ShowsSlice => ({
  createSellerShow: (show) => {
    update(s => {
      const created: SellerShow = {
        ...show,
        id: makeId('show_'),
        products: [],
        stats: { viewers: 0, sales: 0, revenue: 0 },
        createdAt: new Date().toISOString(),
      };
      return { ...s, sellerShows: [created, ...s.sellerShows] };
    });
  },

  updateSellerShow: (id, updates) => {
    update(s => ({
      ...s,
      sellerShows: s.sellerShows.map(show => show.id === id ? { ...show, ...updates } : show),
    }));
  },

  addShowProduct: (showId, inventoryId) => {
    update(s => {
      const source = s.inventory.find(p => p.id === inventoryId);
      if (!source) return s;

      return {
        ...s,
        sellerShows: s.sellerShows.map(show => {
          if (show.id !== showId) return show;
          const entry: ShowProduct = {
            id: makeId('sp_'),
            inventoryId: source.id,
            name: source.name,
            sku: source.sku,
            type: source.listingType,
            price: source.price,
            quantity: source.quantity,
            position: show.products.length + 1,
          };
          return { ...show, products: [...show.products, entry] };
        }),
      };
    });
  },

  removeShowProduct: (showId, showProductId) => {
    update(s => ({
      ...s,
      sellerShows: s.sellerShows.map(show => show.id === showId
        ? { ...show, products: show.products.filter(p => p.id !== showProductId) }
        : show),
    }));
  },

  updateShowStatus: (showId, status) => {
    update(s => ({
      ...s,
      sellerShows: s.sellerShows.map(show => show.id === showId ? { ...show, status } : show),
    }));
  },
});
