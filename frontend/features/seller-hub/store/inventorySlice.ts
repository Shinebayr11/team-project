import { InventoryProduct } from '@/features/seller-hub/types';
import { StateUpdater, InventorySlice } from '@/store/types';
import { makeId } from '@/store/state';

/** Stock level drives ACTIVE <-> OUT_OF_STOCK; DRAFT/ARCHIVED are manual states. */
const statusForQuantity = (product: InventoryProduct, quantity: number): InventoryProduct['status'] => {
  if (quantity === 0 && product.status === 'ACTIVE') return 'OUT_OF_STOCK';
  if (quantity > 0 && product.status === 'OUT_OF_STOCK') return 'ACTIVE';
  return product.status;
};

const nextQuantity = (current: number, type: 'add' | 'remove' | 'set', amount: number) => {
  if (type === 'add') return current + amount;
  if (type === 'remove') return Math.max(0, current - amount);
  return Math.max(0, amount);
};

export const createInventorySlice = (update: StateUpdater): InventorySlice => ({
  addInventoryProduct: (product) => {
    update(s => ({
      ...s,
      inventory: [
        {
          ...product,
          id: makeId('inv_'),
          reservedQuantity: 0,
          soldQuantity: 0,
          createdAt: new Date().toISOString(),
        },
        ...s.inventory,
      ],
    }));
  },

  updateInventoryProduct: (id, updates) => {
    update(s => ({
      ...s,
      inventory: s.inventory.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  },

  deleteInventoryProduct: (id) => {
    update(s => ({ ...s, inventory: s.inventory.filter(p => p.id !== id) }));
  },

  adjustStock: (id, type, amount) => {
    update(s => ({
      ...s,
      inventory: s.inventory.map(p => {
        if (p.id !== id) return p;
        const quantity = nextQuantity(p.quantity, type, amount);
        return { ...p, quantity, status: statusForQuantity(p, quantity) };
      }),
    }));
  },

  bulkAction: (ids, action) => {
    update(s => {
      if (action === 'delete') {
        return { ...s, inventory: s.inventory.filter(p => !ids.includes(p.id)) };
      }
      return {
        ...s,
        inventory: s.inventory.map(p => {
          if (!ids.includes(p.id)) return p;
          if (action === 'archive') return { ...p, status: 'ARCHIVED' as const };
          if (action === 'draft') return { ...p, status: 'DRAFT' as const };
          return { ...p, status: p.quantity > 0 ? ('ACTIVE' as const) : ('OUT_OF_STOCK' as const) };
        }),
      };
    });
  },
});
