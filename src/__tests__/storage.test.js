import { describe, it, expect, beforeEach } from 'vitest';
import { Storage } from '../storage.js';
import { DEFAULT_LOCATION_GROUPS } from '../config.js';

describe('Storage', () => {
    beforeEach(() => {
        chrome.storage.sync._reset();
        chrome.runtime.lastError = null;
    });

    describe('loadGroups', () => {
        it('should return stored groups when they exist', async () => {
            const testGroups = [{ id: 'test', name: 'Test Group', spots: [] }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': testGroups });

            const groups = await Storage.loadGroups();
            expect(groups).toEqual(testGroups);
        });

        it('should seed with defaults on first install', async () => {
            const groups = await Storage.loadGroups();
            expect(groups).toEqual(DEFAULT_LOCATION_GROUPS);
        });
    });

    describe('saveGroups', () => {
        it('should save groups to storage', async () => {
            const testGroups = [{ id: 'new', name: 'New Group', spots: [] }];
            await Storage.saveGroups(testGroups);

            const store = chrome.storage.sync._getStore();
            expect(store['surfloop-location-groups']).toEqual(testGroups);
        });

        it('should reject on chrome runtime error', async () => {
            chrome.runtime.lastError = { message: 'Storage error' };

            await expect(Storage.saveGroups([])).rejects.toEqual({ message: 'Storage error' });
        });
    });

    describe('loadSettings', () => {
        it('should return stored settings when they exist', async () => {
            const testSettings = { autoNavigationEnabled: false, rotationDelay: 60000 };
            chrome.storage.sync._setStore({ 'surfloop-settings': testSettings });

            const settings = await Storage.loadSettings();
            expect(settings).toEqual(testSettings);
        });

        it('should return defaults when no settings stored', async () => {
            const settings = await Storage.loadSettings();
            expect(settings).toEqual({
                autoNavigationEnabled: true,
                rotationDelay: 180000
            });
        });
    });

    describe('saveSettings', () => {
        it('should save settings to storage', async () => {
            const testSettings = { autoNavigationEnabled: false, rotationDelay: 120000 };
            await Storage.saveSettings(testSettings);

            const store = chrome.storage.sync._getStore();
            expect(store['surfloop-settings']).toEqual(testSettings);
        });
    });

    describe('addGroup', () => {
        it('should add a new group and return it', async () => {
            chrome.storage.sync._setStore({ 'surfloop-location-groups': [] });

            const newGroup = await Storage.addGroup('My Group');

            expect(newGroup.name).toBe('My Group');
            expect(newGroup.id).toBeDefined();
            expect(newGroup.spots).toEqual([]);

            const store = chrome.storage.sync._getStore();
            expect(store['surfloop-location-groups']).toHaveLength(1);
        });
    });

    describe('updateGroup', () => {
        it('should update group name', async () => {
            const existingGroups = [{ id: 'g1', name: 'Old Name', spots: [] }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const groups = await Storage.updateGroup('g1', 'New Name');

            expect(groups[0].name).toBe('New Name');
        });

        it('should not modify groups if id not found', async () => {
            const existingGroups = [{ id: 'g1', name: 'Group', spots: [] }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const groups = await Storage.updateGroup('nonexistent', 'New Name');

            expect(groups[0].name).toBe('Group');
        });
    });

    describe('deleteGroup', () => {
        it('should remove the group', async () => {
            const existingGroups = [
                { id: 'g1', name: 'Group 1', spots: [] },
                { id: 'g2', name: 'Group 2', spots: [] }
            ];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const groups = await Storage.deleteGroup('g1');

            expect(groups).toHaveLength(1);
            expect(groups[0].id).toBe('g2');
        });
    });

    describe('addSpot', () => {
        it('should add a spot to the specified group', async () => {
            const existingGroups = [{ id: 'g1', name: 'Group', spots: [] }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const spot = await Storage.addSpot('g1', 'Pipeline', 'https://surfline.com/pipeline');

            expect(spot.name).toBe('Pipeline');
            expect(spot.url).toBe('https://surfline.com/pipeline');
            expect(spot.id).toBeDefined();
        });

        it('should return null if group not found', async () => {
            chrome.storage.sync._setStore({ 'surfloop-location-groups': [] });

            const spot = await Storage.addSpot('nonexistent', 'Spot', 'https://url.com');

            expect(spot).toBeNull();
        });
    });

    describe('updateSpot', () => {
        it('should update spot name and url', async () => {
            const existingGroups = [{
                id: 'g1',
                name: 'Group',
                spots: [{ id: 's1', name: 'Old Spot', url: 'https://old.com' }]
            }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const groups = await Storage.updateSpot('g1', 's1', 'New Spot', 'https://new.com');

            expect(groups[0].spots[0].name).toBe('New Spot');
            expect(groups[0].spots[0].url).toBe('https://new.com');
        });
    });

    describe('deleteSpot', () => {
        it('should remove the spot from the group', async () => {
            const existingGroups = [{
                id: 'g1',
                name: 'Group',
                spots: [
                    { id: 's1', name: 'Spot 1', url: 'https://1.com' },
                    { id: 's2', name: 'Spot 2', url: 'https://2.com' }
                ]
            }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const groups = await Storage.deleteSpot('g1', 's1');

            expect(groups[0].spots).toHaveLength(1);
            expect(groups[0].spots[0].id).toBe('s2');
        });
    });

    describe('moveSpot', () => {
        it('should reorder spots within the same group', async () => {
            const existingGroups = [{
                id: 'g1',
                name: 'Group',
                spots: [
                    { id: 's1', name: 'Spot 1', url: 'https://1.com' },
                    { id: 's2', name: 'Spot 2', url: 'https://2.com' },
                    { id: 's3', name: 'Spot 3', url: 'https://3.com' }
                ]
            }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const groups = await Storage.moveSpot('g1', 'g1', 's3', 0);

            expect(groups[0].spots[0].id).toBe('s3');
            expect(groups[0].spots[1].id).toBe('s1');
            expect(groups[0].spots[2].id).toBe('s2');
        });

        it('should move spot between groups', async () => {
            const existingGroups = [
                { id: 'g1', name: 'Group 1', spots: [{ id: 's1', name: 'Spot 1', url: 'https://1.com' }] },
                { id: 'g2', name: 'Group 2', spots: [] }
            ];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': existingGroups });

            const groups = await Storage.moveSpot('g1', 'g2', 's1', 0);

            expect(groups[0].spots).toHaveLength(0);
            expect(groups[1].spots).toHaveLength(1);
            expect(groups[1].spots[0].id).toBe('s1');
        });
    });

    describe('exportConfig', () => {
        it('should export groups and settings as JSON', async () => {
            const testGroups = [{ id: 'g1', name: 'Group', spots: [] }];
            const testSettings = { autoNavigationEnabled: true, rotationDelay: 180000 };
            chrome.storage.sync._setStore({
                'surfloop-location-groups': testGroups,
                'surfloop-settings': testSettings
            });

            const json = await Storage.exportConfig();
            const parsed = JSON.parse(json);

            expect(parsed.locationGroups).toEqual(testGroups);
            expect(parsed.settings).toEqual(testSettings);
        });
    });

    describe('importConfig', () => {
        it('should import groups and settings from JSON', async () => {
            const config = {
                locationGroups: [{ id: 'imported', name: 'Imported', spots: [] }],
                settings: { autoNavigationEnabled: false, rotationDelay: 60000 }
            };

            await Storage.importConfig(JSON.stringify(config));

            const store = chrome.storage.sync._getStore();
            expect(store['surfloop-location-groups']).toEqual(config.locationGroups);
            expect(store['surfloop-settings']).toEqual(config.settings);
        });

        it('should throw on invalid JSON', async () => {
            await expect(Storage.importConfig('invalid json')).rejects.toThrow();
        });
    });

    describe('restoreDefaults', () => {
        it('should reset groups to defaults', async () => {
            chrome.storage.sync._setStore({
                'surfloop-location-groups': [{ id: 'custom', name: 'Custom', spots: [] }],
                'surfloop-settings': { autoNavigationEnabled: false, rotationDelay: 60000 }
            });

            await Storage.restoreDefaults();

            const store = chrome.storage.sync._getStore();
            expect(store['surfloop-location-groups']).toEqual(DEFAULT_LOCATION_GROUPS);
            expect(store['surfloop-settings']).toEqual({
                autoNavigationEnabled: true,
                rotationDelay: 180000
            });
        });
    });
});
