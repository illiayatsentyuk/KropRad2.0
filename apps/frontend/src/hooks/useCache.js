import { useState, useEffect, useCallback } from 'react';
import { getCacheStats, clearAllCache, invalidateCachePattern } from '../utils/cacheApi';

/**
 * React hook for cache management
 * Provides utilities to manage cache from components
 */
export const useCache = () => {
  const [cacheStats, setCacheStats] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Refresh cache statistics
   */
  const refreshStats = useCallback(async () => {
    try {
      const stats = await getCacheStats();
      setCacheStats(stats);
      return stats;
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return [];
    }
  }, []);

  /**
   * Clear all cache
   */
  const clearCache = useCallback(async () => {
    setLoading(true);
    try {
      await clearAllCache();
      await refreshStats();
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshStats]);

  /**
   * Invalidate cache by pattern
   */
  const invalidatePattern = useCallback(async (pattern) => {
    setLoading(true);
    try {
      const count = await invalidateCachePattern(pattern);
      await refreshStats();
      return count;
    } catch (error) {
      console.error(`Failed to invalidate pattern ${pattern}:`, error);
      return 0;
    } finally {
      setLoading(false);
    }
  }, [refreshStats]);

  /**
   * Get cache size summary
   */
  const getCacheSummary = useCallback(() => {
    const totalEntries = cacheStats.length;
    const avgAge = totalEntries > 0
      ? cacheStats.reduce((sum, entry) => sum + entry.age, 0) / totalEntries
      : 0;
    
    return {
      totalEntries,
      avgAge: Math.round(avgAge / 1000), // Convert to seconds
      oldestEntry: totalEntries > 0
        ? Math.max(...cacheStats.map(e => e.age))
        : 0,
    };
  }, [cacheStats]);

  // Load stats on mount
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    cacheStats,
    loading,
    refreshStats,
    clearCache,
    invalidatePattern,
    getCacheSummary,
  };
};

/**
 * Hook to check if cache is supported
 */
export const useCacheSupport = () => {
  const [isSupported] = useState(() => 'caches' in window);
  return isSupported;
};

export default useCache;

