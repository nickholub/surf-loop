import { STORAGE_KEYS, DEFAULT_LOCATION_GROUPS } from './config.js';

// Generate unique ID for groups/spots
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Storage utilities for location groups
export const Storage = {
    // Load location groups from chrome.storage.sync
    async loadGroups() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([STORAGE_KEYS.LOCATION_GROUPS], (result) => {
                if (result[STORAGE_KEYS.LOCATION_GROUPS]) {
                    resolve(result[STORAGE_KEYS.LOCATION_GROUPS]);
                } else {
                    // First install - seed with defaults
                    this.saveGroups(DEFAULT_LOCATION_GROUPS).then(() => {
                        resolve(DEFAULT_LOCATION_GROUPS);
                    });
                }
            });
        });
    },

    // Save location groups to chrome.storage.sync
    async saveGroups(groups) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [STORAGE_KEYS.LOCATION_GROUPS]: groups }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    },

    // Load settings
    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([STORAGE_KEYS.SETTINGS], (result) => {
                const defaults = {
                    autoNavigationEnabled: true,
                    rotationDelay: 180000
                };
                resolve(result[STORAGE_KEYS.SETTINGS] || defaults);
            });
        });
    },

    // Save settings
    async saveSettings(settings) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [STORAGE_KEYS.SETTINGS]: settings }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    },

    // Add a new group
    async addGroup(name) {
        const groups = await this.loadGroups();
        const newGroup = {
            id: generateId(),
            name: name,
            spots: []
        };
        groups.push(newGroup);
        await this.saveGroups(groups);
        return newGroup;
    },

    // Update a group's name
    async updateGroup(groupId, name) {
        const groups = await this.loadGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            group.name = name;
            await this.saveGroups(groups);
        }
        return groups;
    },

    // Delete a group
    async deleteGroup(groupId) {
        const groups = await this.loadGroups();
        const filtered = groups.filter(g => g.id !== groupId);
        await this.saveGroups(filtered);
        return filtered;
    },

    // Add a spot to a group
    async addSpot(groupId, name, url) {
        const groups = await this.loadGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const newSpot = {
                id: generateId(),
                name: name,
                url: url
            };
            group.spots.push(newSpot);
            await this.saveGroups(groups);
            return newSpot;
        }
        return null;
    },

    // Update a spot
    async updateSpot(groupId, spotId, name, url) {
        const groups = await this.loadGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const spot = group.spots.find(s => s.id === spotId);
            if (spot) {
                spot.name = name;
                spot.url = url;
                await this.saveGroups(groups);
            }
        }
        return groups;
    },

    // Delete a spot
    async deleteSpot(groupId, spotId) {
        const groups = await this.loadGroups();
        const group = groups.find(g => g.id === groupId);
        if (group) {
            group.spots = group.spots.filter(s => s.id !== spotId);
            await this.saveGroups(groups);
        }
        return groups;
    },

    // Move spot within or between groups
    async moveSpot(fromGroupId, toGroupId, spotId, newIndex) {
        const groups = await this.loadGroups();
        const fromGroup = groups.find(g => g.id === fromGroupId);
        const toGroup = groups.find(g => g.id === toGroupId);

        if (fromGroup && toGroup) {
            const spotIndex = fromGroup.spots.findIndex(s => s.id === spotId);
            if (spotIndex !== -1) {
                const [spot] = fromGroup.spots.splice(spotIndex, 1);
                toGroup.spots.splice(newIndex, 0, spot);
                await this.saveGroups(groups);
            }
        }
        return groups;
    },

    // Export configuration as JSON
    async exportConfig() {
        const groups = await this.loadGroups();
        const settings = await this.loadSettings();
        return JSON.stringify({ locationGroups: groups, settings: settings }, null, 2);
    },

    // Import configuration from JSON
    async importConfig(jsonString) {
        const config = JSON.parse(jsonString);
        if (config.locationGroups) {
            await this.saveGroups(config.locationGroups);
        }
        if (config.settings) {
            await this.saveSettings(config.settings);
        }
        return config;
    },

    // Restore all settings to defaults
    async restoreDefaults() {
        await this.saveGroups(DEFAULT_LOCATION_GROUPS);
        await this.saveSettings({
            autoNavigationEnabled: true,
            rotationDelay: 180000
        });
    },

    // Migrate from localStorage (if any old settings exist)
    async migrateFromLocalStorage() {
        try {
            const oldAutoNavState = localStorage.getItem('surfloop-auto-navigation-enabled');
            if (oldAutoNavState !== null) {
                const settings = await this.loadSettings();
                settings.autoNavigationEnabled = oldAutoNavState !== 'false';
                await this.saveSettings(settings);
                localStorage.removeItem('surfloop-auto-navigation-enabled');
            }
        } catch (e) {
            console.error('Migration from localStorage failed:', e);
        }
    }
};
