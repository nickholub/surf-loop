import { vi } from 'vitest';

// Mock chrome.storage.sync API
const createStorageMock = () => {
    let store = {};
    return {
        get: vi.fn((keys, callback) => {
            const result = {};
            const keyArray = Array.isArray(keys) ? keys : [keys];
            keyArray.forEach(key => {
                if (store[key] !== undefined) {
                    result[key] = store[key];
                }
            });
            callback(result);
        }),
        set: vi.fn((items, callback) => {
            Object.assign(store, items);
            if (callback) callback();
        }),
        clear: vi.fn((callback) => {
            store = {};
            if (callback) callback();
        }),
        _getStore: () => store,
        _setStore: (newStore) => { store = newStore; },
        _reset: () => { store = {}; }
    };
};

// Create mock
const storageMock = createStorageMock();

// Set up global chrome object
globalThis.chrome = {
    storage: {
        sync: storageMock
    },
    runtime: {
        lastError: null
    }
};

// Export for test access
export { storageMock };
