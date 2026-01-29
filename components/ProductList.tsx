import React from 'react';
import { FlatList, Platform, ScrollView, StyleSheet } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { ProductItem } from '@/components/ProductItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export function ProductList({ products, onProductPress }: ProductListProps) {
  const handleProductPress = (product: Product) => {
    onProductPress?.(product);
  };

  if (Platform.OS === 'web') {
    // Web: Grid layout
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.webContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>
            Discover Products
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Find the perfect item for your needs
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleProductPress}
            />
          ))}
        </ThemedView>
      </ScrollView>
    );
  }

  // Mobile: List layout
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>
          Discover Products
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Find the perfect item for your needs
        </ThemedText>
      </ThemedView>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={handleProductPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mobileContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: Platform.OS === 'web' ? 24 : 24,
    paddingTop: Platform.OS === 'web' ? 40 : 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  mobileContainer: {
    paddingBottom: 32,
  },
  webContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
