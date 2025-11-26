/**
 * Cache API utility for improved fetching performance
 * Supports multiple cache strategies and TTL management
 */

const CACHE_NAME = 'kroprad-api-cache-v1';
const CACHE_DURATION = {
  articles: 5 * 60 * 1000,      // 5 minutes for articles list
  article: 10 * 60 * 1000,      // 10 minutes for single article
  ratings: 2 * 60 * 1000,       // 2 minutes for ratings
  default: 5 * 60 * 1000,       // 5 minutes default
};

/**
 * Create cache key with timestamp metadata
 */
const createCacheEntry = (data) => {
  return {
    data,
    timestamp: Date.now(),
    version: 1,
  };
};

/**
 * Check if cache entry is still valid
 */
const isCacheValid = (entry, duration) => {
  if (!entry || !entry.timestamp) return false;
  const age = Date.now() - entry.timestamp;
  return age < duration;
};

/**
 * Get cache duration based on URL pattern
 */
const getCacheDuration = (url) => {
  if (url.includes('/articles/') && /\/articles\/\d+$/.test(url)) {
    return CACHE_DURATION.article;
  }
  if (url.includes('/articles')) {
    return CACHE_DURATION.articles;
  }
  if (url.includes('/reaction')) {
    return CACHE_DURATION.ratings;
  }
  return CACHE_DURATION.default;
};

/**
 * Cache-First Strategy: Check cache first, fallback to network
 * Best for: Articles list, static content that doesn't change often
 */
export const cacheFirst = async (url, fetchFunction, options = {}) => {
  const { forceFresh = false, duration } = options;
  const cacheDuration = duration || getCacheDuration(url);
  
  try {
    // Check cache first (unless forceFresh is true)
    if (!forceFresh && 'caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      
      if (cached) {
        const entry = await cached.json();
        if (isCacheValid(entry, cacheDuration)) {
          console.log(`[Cache Hit] ${url}`);
          return entry.data;
        }
        // Cache expired, delete it
        await cache.delete(url);
      }
    }

    // Fetch from network
    console.log(`[Network Fetch] ${url}`);
    const data = await fetchFunction();

    // Store in cache
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const response = new Response(JSON.stringify(createCacheEntry(data)), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put(url, response);
    }

    return data;
  } catch (error) {
    // If network fails, try to return stale cache as fallback
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) {
        const entry = await cached.json();
        console.log(`[Stale Cache Used] ${url}`);
        return entry.data;
      }
    }
    throw error;
  }
};

/**
 * Network-First Strategy: Try network first, fallback to cache
 * Best for: Dynamic content, user-specific data
 */
export const networkFirst = async (url, fetchFunction, options = {}) => {
  const { duration } = options;
  const cacheDuration = duration || getCacheDuration(url);

  try {
    // Try network first
    console.log(`[Network First] ${url}`);
    const data = await fetchFunction();

    // Update cache with fresh data
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const response = new Response(JSON.stringify(createCacheEntry(data)), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put(url, response);
    }

    return data;
  } catch (error) {
    // Network failed, try cache
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      
      if (cached) {
        const entry = await cached.json();
        if (isCacheValid(entry, cacheDuration)) {
          console.log(`[Cache Fallback] ${url}`);
          return entry.data;
        }
      }
    }
    throw error;
  }
};

/**
 * Stale-While-Revalidate: Return cache immediately, update in background
 * Best for: Fast UX with background updates
 */
export const staleWhileRevalidate = async (url, fetchFunction, options = {}) => {
  const { duration } = options;
  const cacheDuration = duration || getCacheDuration(url);
  let cacheData = null;

  // Try to get from cache immediately
  if ('caches' in window) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url);
    
    if (cached) {
      const entry = await cached.json();
      if (isCacheValid(entry, cacheDuration)) {
        cacheData = entry.data;
        console.log(`[Cache Returned] ${url}`);
      }
    }
  }

  // Fetch fresh data in background
  const fetchPromise = (async () => {
    try {
      console.log(`[Background Revalidate] ${url}`);
      const data = await fetchFunction();
      
      // Update cache
      if ('caches' in window) {
        const cache = await caches.open(CACHE_NAME);
        const response = new Response(JSON.stringify(createCacheEntry(data)), {
          headers: { 'Content-Type': 'application/json' },
        });
        await cache.put(url, response);
      }
      
      return data;
    } catch (error) {
      console.error(`[Revalidate Failed] ${url}`, error);
      return cacheData;
    }
  })();

  // Return cache if available, otherwise wait for network
  return cacheData !== null ? cacheData : await fetchPromise;
};

/**
 * Invalidate specific cache entry
 */
export const invalidateCache = async (url) => {
  if ('caches' in window) {
    const cache = await caches.open(CACHE_NAME);
    const deleted = await cache.delete(url);
    if (deleted) {
      console.log(`[Cache Invalidated] ${url}`);
    }
    return deleted;
  }
  return false;
};

/**
 * Invalidate cache by pattern
 */
export const invalidateCachePattern = async (pattern) => {
  if ('caches' in window) {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const deletions = requests
      .filter(request => request.url.includes(pattern))
      .map(request => cache.delete(request));
    
    await Promise.all(deletions);
    console.log(`[Cache Pattern Invalidated] ${pattern} (${deletions.length} entries)`);
    return deletions.length;
  }
  return 0;
};

/**
 * Clear all cache
 */
export const clearAllCache = async () => {
  if ('caches' in window) {
    const deleted = await caches.delete(CACHE_NAME);
    if (deleted) {
      console.log('[All Cache Cleared]');
    }
    return deleted;
  }
  return false;
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  if ('caches' in window) {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const entries = await Promise.all(
      requests.map(async (request) => {
        const response = await cache.match(request);
        if (response) {
          const entry = await response.json();
          return {
            url: request.url,
            age: Date.now() - entry.timestamp,
            timestamp: entry.timestamp,
          };
        }
        return null;
      })
    );
    
    return entries.filter(Boolean);
  }
  return [];
};

export default {
  cacheFirst,
  networkFirst,
  staleWhileRevalidate,
  invalidateCache,
  invalidateCachePattern,
  clearAllCache,
  getCacheStats,
};

