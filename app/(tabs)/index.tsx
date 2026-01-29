import React from 'react';

import { Dashboard } from '@/components/Dashboard';
import { Product } from '@/types/product';

export default function HomeScreen() {
  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.name);
    // TODO: Navigate to product detail screen
  };

  const handleCategoryPress = (category: string) => {
    console.log('Category pressed:', category);
    // TODO: Navigate to category screen or filter products
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
    // TODO: Navigate to search screen
  };

  return (
    <Dashboard
      onProductPress={handleProductPress}
      onCategoryPress={handleCategoryPress}
      onSearchPress={handleSearchPress}
    />
  );
}
