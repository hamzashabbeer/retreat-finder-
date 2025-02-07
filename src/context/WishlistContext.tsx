import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Retreat } from '@types';

interface WishlistContextType {
  wishlist: Retreat[];
  addToWishlist: (retreat: Retreat) => void;
  removeFromWishlist: (retreatId: string | number) => void;
  isInWishlist: (retreatId: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load wishlist from localStorage on initial render
  const [wishlist, setWishlist] = useState<Retreat[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (retreat: Retreat) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === retreat.id)) {
        return prev;
      }
      return [...prev, retreat];
    });
  };

  const removeFromWishlist = (retreatId: string | number) => {
    setWishlist(prev => prev.filter(item => item.id !== retreatId));
  };

  const isInWishlist = (retreatId: string | number) => {
    return wishlist.some(item => item.id === retreatId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}; 