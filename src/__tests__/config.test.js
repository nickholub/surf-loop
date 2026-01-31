import { describe, it, expect } from 'vitest';
import { CONFIG, STORAGE_KEYS, DEFAULT_LOCATION_GROUPS } from '../config.js';

describe('CONFIG', () => {
    describe('timing constants', () => {
        it('should have PAGE_ROTATION_DELAY of 3 minutes', () => {
            expect(CONFIG.PAGE_ROTATION_DELAY).toBe(3 * 60 * 1000);
        });

        it('should have FULLSCREEN_BUTTON_WAIT_TIMEOUT of 60 seconds', () => {
            expect(CONFIG.FULLSCREEN_BUTTON_WAIT_TIMEOUT).toBe(60 * 1000);
        });

        it('should have FULLSCREEN_BUTTON_CHECK_INTERVAL of 500ms', () => {
            expect(CONFIG.FULLSCREEN_BUTTON_CHECK_INTERVAL).toBe(500);
        });

        it('should have TOAST_DISPLAY_DURATION of 2 seconds', () => {
            expect(CONFIG.TOAST_DISPLAY_DURATION).toBe(2000);
        });

        it('should have DISABLED_PAGE_REFRESH_DELAY of 10 minutes', () => {
            expect(CONFIG.DISABLED_PAGE_REFRESH_DELAY).toBe(10 * 60 * 1000);
        });
    });

    describe('OVERLAY_STYLES', () => {
        it('should have required positioning styles', () => {
            expect(CONFIG.OVERLAY_STYLES.position).toBe('fixed');
            expect(CONFIG.OVERLAY_STYLES.top).toBe('0');
            expect(CONFIG.OVERLAY_STYLES.left).toBe('0');
            expect(CONFIG.OVERLAY_STYLES.width).toBe('100%');
            expect(CONFIG.OVERLAY_STYLES.height).toBe('100%');
        });

        it('should have maximum z-index', () => {
            expect(CONFIG.OVERLAY_STYLES['z-index']).toBe('2147483647');
        });
    });

    describe('VIDEO_WRAPPER_STYLES', () => {
        it('should enforce 16:9 aspect ratio', () => {
            expect(CONFIG.VIDEO_WRAPPER_STYLES.width).toContain('177.78vh');
            expect(CONFIG.VIDEO_WRAPPER_STYLES.height).toContain('56.25vw');
        });
    });

    describe('SELECTORS', () => {
        it('should have VIDEO_PLAYER_WRAPPER selector', () => {
            expect(CONFIG.SELECTORS.VIDEO_PLAYER_WRAPPER).toBeDefined();
            expect(CONFIG.SELECTORS.VIDEO_PLAYER_WRAPPER).toContain('CamPlayerKbygRewinds');
        });

        it('should have FULLSCREEN_BUTTON selector', () => {
            expect(CONFIG.SELECTORS.FULLSCREEN_BUTTON).toBeDefined();
            expect(CONFIG.SELECTORS.FULLSCREEN_BUTTON).toContain('FullscreenControl');
        });

        it('should have VIDEO_OVERLAY selector', () => {
            expect(CONFIG.SELECTORS.VIDEO_OVERLAY).toBe('#video-overlay');
        });
    });
});

describe('STORAGE_KEYS', () => {
    it('should have LOCATION_GROUPS key', () => {
        expect(STORAGE_KEYS.LOCATION_GROUPS).toBe('surfloop-location-groups');
    });

    it('should have SETTINGS key', () => {
        expect(STORAGE_KEYS.SETTINGS).toBe('surfloop-settings');
    });
});

describe('DEFAULT_LOCATION_GROUPS', () => {
    it('should be an array', () => {
        expect(Array.isArray(DEFAULT_LOCATION_GROUPS)).toBe(true);
    });

    it('should have at least one group', () => {
        expect(DEFAULT_LOCATION_GROUPS.length).toBeGreaterThan(0);
    });

    it('should have groups with required properties', () => {
        DEFAULT_LOCATION_GROUPS.forEach(group => {
            expect(group).toHaveProperty('id');
            expect(group).toHaveProperty('name');
            expect(group).toHaveProperty('spots');
            expect(Array.isArray(group.spots)).toBe(true);
        });
    });

    it('should have spots with required properties', () => {
        DEFAULT_LOCATION_GROUPS.forEach(group => {
            group.spots.forEach(spot => {
                expect(spot).toHaveProperty('id');
                expect(spot).toHaveProperty('name');
                expect(spot).toHaveProperty('url');
                expect(spot.url).toMatch(/^https:\/\/www\.surfline\.com/);
            });
        });
    });

    it('should include SF Bay group', () => {
        const sfBay = DEFAULT_LOCATION_GROUPS.find(g => g.id === 'sf-bay');
        expect(sfBay).toBeDefined();
        expect(sfBay.name).toBe('SF Bay');
    });

    it('should include Oahu group', () => {
        const oahu = DEFAULT_LOCATION_GROUPS.find(g => g.id === 'oahu');
        expect(oahu).toBeDefined();
        expect(oahu.name).toBe('Oahu');
    });
});
