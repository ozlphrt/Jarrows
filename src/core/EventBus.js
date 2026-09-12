/**
 * EventBus - Central decoupled publish/subscribe event system
 * Eliminates direct window.* couplings and ad-hoc temporal polling.
 */

class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('EventBus callback must be a function');
        }
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     */
    off(event, callback) {
        const set = this.listeners.get(event);
        if (set) {
            set.delete(callback);
            if (set.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
        const wrapper = (data) => {
            this.off(event, wrapper);
            callback(data);
        };
        return this.on(event, wrapper);
    }

    /**
     * Emit an event with optional payload
     * @param {string} event - Event name
     * @param {any} [data] - Event payload
     */
    emit(event, data) {
        const set = this.listeners.get(event);
        if (!set || set.size === 0) return;

        // Copy into array before iteration to prevent issues if handlers modify listeners
        const callbacks = Array.from(set);
        for (let i = 0; i < callbacks.length; i++) {
            try {
                callbacks[i](data);
            } catch (err) {
                console.error(`[EventBus] Error in listener for event "${event}":`, err);
            }
        }
    }

    /**
     * Clear all listeners or all listeners for a specific event
     * @param {string} [event] - Specific event to clear
     */
    clear(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}

export const eventBus = new EventBus();
export { EventBus };
