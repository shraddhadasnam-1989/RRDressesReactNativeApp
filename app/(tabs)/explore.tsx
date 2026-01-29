import React from 'react';

import { ProductList } from '@/components/ProductList';
import { ThemedView } from '@/components/themed-view';
import { mockProducts } from '@/data/products';
import { Product } from '@/types/product';

export default function ProductsScreen() {
  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.name);
    // TODO: Navigate to product detail screen
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ProductList products={mockProducts} onProductPress={handleProductPress} />
    </ThemedView>
  );
}
