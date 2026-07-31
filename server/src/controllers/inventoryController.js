import { supabase } from '../config/supabase.js';

export const getInventoryDashboard = async (req, res, next) => {
  try {
    // 1. Fetch all inventory records, joined with products and spare parts
    const { data: inventoryItems, error } = await supabase
      .from('inventory')
      .select(`
        *,
        product:products(id, name, price, is_available, brand:brands(name)),
        spare_part:spare_parts(id, name, price, is_available, brand:brands(name))
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // 2. Compute statistics
    let totalItems = inventoryItems.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    const items = inventoryItems.map(item => {
      const isLowStock = item.stock_qty <= item.low_stock_threshold && item.stock_qty > 0;
      const isOutOfStock = item.stock_qty === 0;

      if (isLowStock) lowStockCount++;
      if (isOutOfStock) outOfStockCount++;

      // Flatten item info for UI consumption
      const details = item.item_type === 'product' ? item.product : item.spare_part;
      return {
        id: item.id,
        item_type: item.item_type,
        product_id: item.product_id,
        spare_part_id: item.spare_part_id,
        name: details?.name || 'Unknown Item',
        brand: details?.brand?.name || 'Generic',
        price: details?.price || 0,
        stock_qty: item.stock_qty,
        low_stock_threshold: item.low_stock_threshold,
        is_available: details?.is_available ?? false,
        status: isOutOfStock ? 'Out of Stock' : (isLowStock ? 'Low Stock' : 'In Stock'),
        updated_at: item.updated_at
      };
    });

    res.status(200).json({
      summary: {
        totalItems,
        lowStockCount,
        outOfStockCount,
        availableStockCount: totalItems - outOfStockCount
      },
      items
    });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { id } = req.params; // Inventory ID
    const { quantity_change, notes, type } = req.body; // e.g. quantity_change = 5 or -2

    if (quantity_change === undefined || isNaN(quantity_change)) {
      return res.status(400).json({ error: 'Quantity change must be a valid number' });
    }

    const change = parseInt(quantity_change);

    // 1. Fetch current inventory record
    const { data: currentInv, error: fetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentInv) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }

    // 2. Calculate new stock quantity (must not be negative)
    const newStock = Math.max(0, currentInv.stock_qty + change);
    const actualChange = newStock - currentInv.stock_qty;

    // 3. Update stock in inventory
    const { data: updatedInv, error: updateError } = await supabase
      .from('inventory')
      .update({
        stock_qty: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 4. Also keep products/spare_parts table stock_qty in sync
    if (currentInv.item_type === 'product') {
      // Products don't directly have stock_qty in our schema (it's in inventory),
      // but if we had one we'd sync it.
    } else if (currentInv.item_type === 'spare_part') {
      // Spare parts DO have stock_qty in their table, let's update it!
      await supabase
        .from('spare_parts')
        .update({ stock_qty: newStock })
        .eq('id', currentInv.spare_part_id);
    }

    // 5. Insert history record
    const historyType = type || (change >= 0 ? 'increase' : 'decrease');
    const { error: historyError } = await supabase
      .from('inventory_history')
      .insert({
        inventory_id: id,
        quantity_change: actualChange,
        type: historyType,
        notes: notes || `Adjusted stock by ${actualChange}`
      });

    if (historyError) {
      console.error('Failed to write inventory history:', historyError);
    }

    res.status(200).json({
      message: 'Stock adjusted successfully',
      inventory: updatedInv,
      actualChange
    });
  } catch (error) {
    next(error);
  }
};

export const getStockHistory = async (req, res, next) => {
  try {
    const { id } = req.params; // Inventory ID

    const { data: history, error } = await supabase
      .from('inventory_history')
      .select('*')
      .eq('inventory_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
