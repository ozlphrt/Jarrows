/**
 * Offline Queue Management for Stats
 * Uses IndexedDB to queue stats submissions when offline
 */

const DB_NAME = 'jarrows_stats';
const DB_VERSION = 1;
const STORE_SUBMISSIONS = 'pending_submissions';
const STORE_CACHE = 'local_stats_cache';

let db = null;

/**
 * Initialize IndexedDB
 */
export async function initStatsDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Failed to open stats database:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('Stats database opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            // Create pending submissions store
            if (!database.objectStoreNames.contains(STORE_SUBMISSIONS)) {
                const submissionsStore = database.createObjectStore(STORE_SUBMISSIONS, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                submissionsStore.createIndex('timestamp', 'timestamp', { unique: false });
            }

            // Create stats cache store
            if (!database.objectStoreNames.contains(STORE_CACHE)) {
                const cacheStore = database.createObjectStore(STORE_CACHE, {
                    keyPath: 'level'
                });
                cacheStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
            }
        };
    });
}

/**
 * Get database instance (initialize if needed)
 */
async function getDB() {
    if (!db) {
        await initStatsDB();
    }
    return db;
}

/**
 * Queue a stats submission for later (when offline)
 */
export async function queueSubmission(stats) {
    try {
        const database = await getDB();
        const transaction = database.transaction([STORE_SUBMISSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SUBMISSIONS);

        const submission = {
            ...stats,
            timestamp: Date.now(),
            retryCount: 0
        };

        const request = store.add(submission);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('Stats submission queued:', submission);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Failed to queue submission:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error queueing submission:', error);
        // Fallback to localStorage if IndexedDB fails
        try {
            const queue = JSON.parse(localStorage.getItem('jarrows_stats_queue') || '[]');
            queue.push({ ...stats, timestamp: Date.now() });
            localStorage.setItem('jarrows_stats_queue', JSON.stringify(queue));
            console.log('Stats submission queued in localStorage fallback');
        } catch (e) {
            console.error('Failed to queue in localStorage fallback:', e);
        }
    }
}

/**
 * Get all pending submissions
 */
export async function getPendingSubmissions() {
    try {
        const database = await getDB();
        const transaction = database.transaction([STORE_SUBMISSIONS], 'readonly');
        const store = transaction.objectStore(STORE_SUBMISSIONS);
        const index = store.index('timestamp');

        const request = index.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result || []);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error getting pending submissions:', error);
        // Fallback to localStorage
        try {
            const queue = JSON.parse(localStorage.getItem('jarrows_stats_queue') || '[]');
            return queue;
        } catch (e) {
            return [];
        }
    }
}

/**
 * Remove a submission from the queue (after successful submission)
 */
export async function removeSubmission(id) {
    try {
        const database = await getDB();
        const transaction = database.transaction([STORE_SUBMISSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SUBMISSIONS);

        const request = store.delete(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error removing submission:', error);
        // Fallback: try to remove from localStorage queue
        try {
            const queue = JSON.parse(localStorage.getItem('jarrows_stats_queue') || '[]');
            const filtered = queue.filter((item, index) => index !== id);
            localStorage.setItem('jarrows_stats_queue', JSON.stringify(filtered));
        } catch (e) {
            // Ignore
        }
    }
}

/**
 * Clear all pending submissions (after successful sync)
 */
export async function clearPendingSubmissions() {
    try {
        const database = await getDB();
        const transaction = database.transaction([STORE_SUBMISSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SUBMISSIONS);

        const request = store.clear();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('All pending submissions cleared');
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error clearing submissions:', error);
        // Fallback: clear localStorage queue
        try {
            localStorage.removeItem('jarrows_stats_queue');
        } catch (e) {
            // Ignore
        }
    }
}

/**
 * Cache community stats for a level
 */
export async function cacheLevelStats(level, stats) {
    try {
        const database = await getDB();
        const transaction = database.transaction([STORE_CACHE], 'readwrite');
        const store = transaction.objectStore(STORE_CACHE);

        const cached = {
            level,
            stats,
            lastUpdated: Date.now()
        };

        const request = store.put(cached);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error caching level stats:', error);
        // Fallback to localStorage
        try {
            const cache = JSON.parse(localStorage.getItem('jarrows_stats_cache') || '{}');
            cache[level] = { stats, lastUpdated: Date.now() };
            localStorage.setItem('jarrows_stats_cache', JSON.stringify(cache));
        } catch (e) {
            console.error('Failed to cache in localStorage fallback:', e);
        }
    }
}

/**
 * Get cached community stats for a level
 */
export async function getCachedLevelStats(level) {
    try {
        const database = await getDB();
        const transaction = database.transaction([STORE_CACHE], 'readonly');
        const store = transaction.objectStore(STORE_CACHE);

        const request = store.get(level);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    // Check if cache is still valid (1 hour TTL)
                    const age = Date.now() - result.lastUpdated;
                    if (age < 3600000) { // 1 hour
                        resolve(result.stats);
                    } else {
                        resolve(null); // Cache expired
                    }
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error getting cached stats:', error);
        // Fallback to localStorage
        try {
            const cache = JSON.parse(localStorage.getItem('jarrows_stats_cache') || '{}');
            const cached = cache[level];
            if (cached) {
                const age = Date.now() - cached.lastUpdated;
                if (age < 3600000) { // 1 hour
                    return cached.stats;
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }
}

/**
 * Clear expired cache entries
 */
export async function clearExpiredCache() {
    try {
        const database = await getDB();
        const transaction = database.transaction([STORE_CACHE], 'readwrite');
        const store = transaction.objectStore(STORE_CACHE);
        const index = store.index('lastUpdated');

        const request = index.openCursor();
        const now = Date.now();
        const maxAge = 3600000; // 1 hour

        return new Promise((resolve) => {
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const age = now - cursor.value.lastUpdated;
                    if (age > maxAge) {
                        cursor.delete();
                    }
                    cursor.continue();
                } else {
                    resolve();
                }
            };

            request.onerror = () => {
                resolve(); // Don't fail on cleanup
            };
        });
    } catch (error) {
        console.error('Error clearing expired cache:', error);
    }
}


