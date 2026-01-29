import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { ProductItem } from '@/components/ProductItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockProducts } from '@/data/products';
import { Product } from '@/types/product';

interface DashboardProps {
  onProductPress?: (product: Product) => void;
  onCategoryPress?: (category: string) => void;
  onSearchPress?: () => void;
}

const categories = ['All', 'Audio', 'Wearables', 'Gaming', 'Fitness', 'Tech'];
const featuredProducts = mockProducts.slice(0, 4);
const popularProducts = mockProducts.slice(4, 8);

export function Dashboard({ onProductPress, onCategoryPress, onSearchPress }: DashboardProps) {
  const handleProductPress = (product: Product) => {
    onProductPress?.(product);
  };

  const handleCategoryPress = (category: string) => {
    onCategoryPress?.(category);
  };

  const handleSearchPress = () => {
    onSearchPress?.();
  };

  if (Platform.OS === 'web') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ThemedView style={styles.heroSection}>
          <View style={styles.heroContent}>
            <ThemedText style={styles.heroTitle}>Welcome to ProductStore</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Discover amazing products at unbeatable prices
            </ThemedText>
            <TouchableOpacity style={styles.heroButton} onPress={handleSearchPress}>
              <IconSymbol size={20} name="search" color="#ffffff" />
              <ThemedText style={styles.heroButtonText}>Start Shopping</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Categories Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Shop by Category</ThemedText>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <ThemedText style={styles.categoryText}>{category}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Featured Products */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Featured Products</ThemedText>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
              />
            ))}
          </View>
        </ThemedView>

        {/* Popular Products */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Popular This Week</ThemedText>
          <View style={styles.productsGrid}>
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
              />
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    );
  }

  // Mobile Layout
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Search */}
      <ThemedView style={styles.mobileHeader}>
        <View style={styles.headerTop}>
          <ThemedText style={styles.welcomeText}>Welcome back!</ThemedText>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <IconSymbol size={20} name="search" color="#007AFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <IconSymbol size={16} name="search" color="#666666" />
          <ThemedText style={styles.searchPlaceholder}>Search products...</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Hero Banner */}
      <ThemedView style={styles.mobileHero}>
        <ThemedText style={styles.mobileHeroTitle}>Discover Amazing Products</ThemedText>
        <ThemedText style={styles.mobileHeroSubtitle}>
          Shop the latest trends with unbeatable deals
        </ThemedText>
      </ThemedView>

      {/* Categories Horizontal Scroll */}
      <ThemedView style={styles.mobileSection}>
        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.mobileCategoryChip}
              onPress={() => handleCategoryPress(category)}
            >
              <ThemedText style={styles.mobileCategoryText}>{category}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Featured Products */}
      <ThemedView style={styles.mobileSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Featured Products</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Featured Products List */}
      <View style={styles.mobileProductsContainer}>
        {featuredProducts.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onPress={handleProductPress}
          />
        ))}
      </View>

      {/* Popular Products */}
      <ThemedView style={[styles.mobileSection, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Popular This Week</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Popular Products List */}
      <View style={styles.mobileProductsContainer}>
        {popularProducts.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onPress={handleProductPress}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Web Styles
  heroSection: {
    backgroundColor: '#007AFF',
    paddingVertical: 60,
    paddingHorizontal: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 800,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
  },
  heroButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },

  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 24,
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 120,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },

  // Mobile Styles
  mobileHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },

  mobileHero: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
  },
  mobileHeroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  mobileHeroSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 22,
  },

  mobileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  lastSection: {
    marginBottom: 0,
  },

  categoriesScroll: {
    marginHorizontal: -4,
  },
  mobileCategoryChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  mobileCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },

  mobileProductsContainer: {
    paddingBottom: 16,
  },
});
