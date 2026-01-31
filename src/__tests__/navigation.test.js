import { describe, it, expect, beforeEach, vi } from 'vitest';
import { URLNavigator, AutoNavigation } from '../modules/navigation.js';
import { State } from '../state.js';

// Mock Toast to avoid jQuery/DOM dependency
vi.mock('../utils/toast.js', () => ({
    Toast: {
        show: vi.fn()
    }
}));

// Mock window.location
const mockLocation = {
    href: '',
    reload: vi.fn()
};
vi.stubGlobal('window', { location: mockLocation });

describe('URLNavigator', () => {
    beforeEach(() => {
        chrome.storage.sync._reset();
        URLNavigator.urls = null;
        URLNavigator.currentIndex = -1;
        URLNavigator.currentGroup = null;
        mockLocation.href = '';
    });

    describe('init', () => {
        it('should find current URL in a group and set state', async () => {
            const groups = [{
                id: 'test-group',
                name: 'Test Group',
                spots: [
                    { id: 's1', name: 'Spot 1', url: 'https://www.surfline.com/surf-report/spot-1/123' },
                    { id: 's2', name: 'Spot 2', url: 'https://www.surfline.com/surf-report/spot-2/456' }
                ]
            }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': groups });

            const result = await URLNavigator.init('https://www.surfline.com/surf-report/spot-1/123');

            expect(result).toBe(true);
            expect(URLNavigator.currentGroup).toEqual(groups[0]);
            expect(URLNavigator.currentIndex).toBe(0);
            expect(URLNavigator.urls).toEqual([
                'https://www.surfline.com/surf-report/spot-1/123',
                'https://www.surfline.com/surf-report/spot-2/456'
            ]);
        });

        it('should match URL without query params', async () => {
            const groups = [{
                id: 'test-group',
                name: 'Test Group',
                spots: [
                    { id: 's1', name: 'Spot 1', url: 'https://www.surfline.com/surf-report/spot-1/123?camId=abc' }
                ]
            }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': groups });

            const result = await URLNavigator.init('https://www.surfline.com/surf-report/spot-1/123?camId=xyz');

            expect(result).toBe(true);
            expect(URLNavigator.currentIndex).toBe(0);
        });

        it('should return false when URL not in any group', async () => {
            const groups = [{
                id: 'test-group',
                name: 'Test Group',
                spots: [
                    { id: 's1', name: 'Spot 1', url: 'https://www.surfline.com/surf-report/spot-1/123' }
                ]
            }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': groups });

            const result = await URLNavigator.init('https://www.surfline.com/surf-report/unknown/999');

            expect(result).toBe(false);
            expect(URLNavigator.currentGroup).toBeNull();
        });

        it('should find correct index when URL is second in list', async () => {
            const groups = [{
                id: 'test-group',
                name: 'Test Group',
                spots: [
                    { id: 's1', name: 'Spot 1', url: 'https://www.surfline.com/surf-report/spot-1/123' },
                    { id: 's2', name: 'Spot 2', url: 'https://www.surfline.com/surf-report/spot-2/456' },
                    { id: 's3', name: 'Spot 3', url: 'https://www.surfline.com/surf-report/spot-3/789' }
                ]
            }];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': groups });

            await URLNavigator.init('https://www.surfline.com/surf-report/spot-2/456');

            expect(URLNavigator.currentIndex).toBe(1);
        });

        it('should search across multiple groups', async () => {
            const groups = [
                {
                    id: 'group-1',
                    name: 'Group 1',
                    spots: [{ id: 's1', name: 'Spot 1', url: 'https://surfline.com/spot-1' }]
                },
                {
                    id: 'group-2',
                    name: 'Group 2',
                    spots: [{ id: 's2', name: 'Spot 2', url: 'https://surfline.com/spot-2' }]
                }
            ];
            chrome.storage.sync._setStore({ 'surfloop-location-groups': groups });

            await URLNavigator.init('https://surfline.com/spot-2');

            expect(URLNavigator.currentGroup.id).toBe('group-2');
        });
    });

    describe('goToNext', () => {
        it('should navigate to next URL', async () => {
            URLNavigator.urls = ['https://url1.com', 'https://url2.com', 'https://url3.com'];
            URLNavigator.currentIndex = 0;

            URLNavigator.goToNext();

            expect(mockLocation.href).toBe('https://url2.com');
        });

        it('should wrap around to first URL', async () => {
            URLNavigator.urls = ['https://url1.com', 'https://url2.com'];
            URLNavigator.currentIndex = 1;

            URLNavigator.goToNext();

            expect(mockLocation.href).toBe('https://url1.com');
        });

        it('should do nothing if urls is null', () => {
            URLNavigator.urls = null;
            mockLocation.href = 'original';

            URLNavigator.goToNext();

            expect(mockLocation.href).toBe('original');
        });
    });

    describe('goToPrevious', () => {
        it('should navigate to previous URL', async () => {
            URLNavigator.urls = ['https://url1.com', 'https://url2.com', 'https://url3.com'];
            URLNavigator.currentIndex = 2;

            URLNavigator.goToPrevious();

            expect(mockLocation.href).toBe('https://url2.com');
        });

        it('should wrap around to last URL', async () => {
            URLNavigator.urls = ['https://url1.com', 'https://url2.com'];
            URLNavigator.currentIndex = 0;

            URLNavigator.goToPrevious();

            expect(mockLocation.href).toBe('https://url2.com');
        });

        it('should do nothing if urls is null', () => {
            URLNavigator.urls = null;
            mockLocation.href = 'original';

            URLNavigator.goToPrevious();

            expect(mockLocation.href).toBe('original');
        });
    });

    describe('getCurrentSpotName', () => {
        it('should return current spot name', () => {
            URLNavigator.currentGroup = {
                spots: [
                    { id: 's1', name: 'Pipeline', url: 'https://url.com' }
                ]
            };
            URLNavigator.currentIndex = 0;

            expect(URLNavigator.getCurrentSpotName()).toBe('Pipeline');
        });

        it('should return null when no current group', () => {
            URLNavigator.currentGroup = null;

            expect(URLNavigator.getCurrentSpotName()).toBeNull();
        });

        it('should return null when index is -1', () => {
            URLNavigator.currentGroup = { spots: [] };
            URLNavigator.currentIndex = -1;

            expect(URLNavigator.getCurrentSpotName()).toBeNull();
        });
    });

    describe('getCurrentGroupName', () => {
        it('should return current group name', () => {
            URLNavigator.currentGroup = { name: 'Hawaii' };

            expect(URLNavigator.getCurrentGroupName()).toBe('Hawaii');
        });

        it('should return null when no current group', () => {
            URLNavigator.currentGroup = null;

            expect(URLNavigator.getCurrentGroupName()).toBeNull();
        });
    });
});

describe('AutoNavigation', () => {
    beforeEach(() => {
        chrome.storage.sync._reset();
        State.autoNavigationEnabled = true;
        State.pageRotationTimeoutId = null;
        State.refreshTimeoutId = null;
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('start', () => {
        it('should set timeout for navigation', async () => {
            chrome.storage.sync._setStore({
                'surfloop-settings': { rotationDelay: 5000, autoNavigationEnabled: true }
            });

            await AutoNavigation.start();

            expect(State.pageRotationTimeoutId).not.toBeNull();
        });

        it('should not start if autoNavigationEnabled is false', async () => {
            State.autoNavigationEnabled = false;

            await AutoNavigation.start();

            expect(State.pageRotationTimeoutId).toBeNull();
        });

        it('should not start if already running', async () => {
            State.pageRotationTimeoutId = 123;
            const originalId = State.pageRotationTimeoutId;

            await AutoNavigation.start();

            expect(State.pageRotationTimeoutId).toBe(originalId);
        });
    });

    describe('stop', () => {
        it('should clear page rotation timeout', () => {
            State.pageRotationTimeoutId = setTimeout(() => {}, 10000);

            AutoNavigation.stop();

            expect(State.pageRotationTimeoutId).toBeNull();
        });

        it('should handle null timeout gracefully', () => {
            State.pageRotationTimeoutId = null;

            expect(() => AutoNavigation.stop()).not.toThrow();
        });
    });

    describe('scheduleRefresh', () => {
        it('should set refresh timeout', () => {
            AutoNavigation.scheduleRefresh();

            expect(State.refreshTimeoutId).not.toBeNull();
        });

        it('should clear existing refresh before setting new one', () => {
            const firstTimeout = setTimeout(() => {}, 10000);
            State.refreshTimeoutId = firstTimeout;

            AutoNavigation.scheduleRefresh();

            expect(State.refreshTimeoutId).not.toBe(firstTimeout);
        });
    });

    describe('cancelRefresh', () => {
        it('should clear refresh timeout', () => {
            State.refreshTimeoutId = setTimeout(() => {}, 10000);

            AutoNavigation.cancelRefresh();

            expect(State.refreshTimeoutId).toBeNull();
        });
    });

    describe('toggle', () => {
        it('should toggle autoNavigationEnabled state', async () => {
            State.autoNavigationEnabled = true;

            await AutoNavigation.toggle();

            expect(State.autoNavigationEnabled).toBe(false);
        });

        it('should persist state after toggle', async () => {
            chrome.storage.sync._setStore({ 'surfloop-settings': {} });

            await AutoNavigation.toggle();

            const store = chrome.storage.sync._getStore();
            expect(store['surfloop-settings'].autoNavigationEnabled).toBe(false);
        });
    });
});
