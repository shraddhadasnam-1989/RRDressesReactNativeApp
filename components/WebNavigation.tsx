import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    name: 'Home',
    path: '/',
    icon: 'house.fill',
  },
  {
    name: 'Products',
    path: '/explore',
    icon: 'bag.fill',
  },
];

export function WebNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    if (path === '/' && pathname !== '/') {
      router.replace('/');
    } else if (path === '/explore' && pathname !== '/explore') {
      router.replace('/explore');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.navBar}>
        <ThemedView style={styles.logoContainer}>
          <ThemedText style={styles.logo}>ProductStore</ThemedText>
        </ThemedView>

        <ThemedView style={styles.navItems}>
          {navItems.map((item) => {
            const isActive = (pathname === '/' && item.path === '/') ||
                           (pathname === '/explore' && item.path === '/explore');

            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.navItem, isActive && styles.activeNavItem]}
                onPress={() => handleNavigation(item.path)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  size={20}
                  name={item.icon}
                  color={isActive ? '#ffffff' : '#007AFF'}
                />
                <ThemedText style={[styles.navText, isActive && styles.activeNavText]}>
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ThemedView>

        <ThemedView style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <IconSymbol size={20} name="person.circle" color="#007AFF" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  activeNavItem: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  activeNavText: {
    color: '#ffffff',
  },
  actions: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
});
