import { StateUpdater, InventorySlice } from '@/store/types';

/**
 * Бараа СЕРВЕР дээр амьдардаг (`/api/product`) — энэ slice бол зөвхөн уншсаныг
 * хадгалах кэш. Бичих үйлдлүүд `features/seller-hub/hooks/useSellerInventory.ts`
 * дотор сервер рүү явж, амжилттай бол эндээс дамжин шинэчлэгдэнэ.
 *
 * Өмнө нь энд нэмэх/засах/устгах логик байсан ч тэр нь зөвхөн localStorage-д
 * бичдэг тул шууд дамжуулалтын "Миний бараа" хэсэгт бараа огт харагддаггүй байв.
 */
export const createInventorySlice = (update: StateUpdater): InventorySlice => ({
  setInventory: (products) => {
    update(s => ({ ...s, inventory: products }));
  },
});
