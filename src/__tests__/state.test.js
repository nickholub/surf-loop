import { describe, it, expect, beforeEach, vi } from 'vitest';
import { State } from '../state.js';

describe('State', () => {
    beforeEach(() => {
        // Reset state properties
        State.checkIntervalId = null;
        State.stopCheckTimeoutId = null;
        State.pageRotationTimeoutId = null;
        State.videoWrapper = null;
        State.videoPlayerWrapper = null;
        State.originalParent = null;
        State.originalIndex = null;
        State.autoNavigationEnabled = true;
        State.toastTimeoutId = null;
        State.refreshTimeoutId = null;

        vi.clearAllTimers();
        vi.useRealTimers();
    });

    describe('initial state', () => {
        it('should have autoNavigationEnabled true by default', () => {
            expect(State.autoNavigationEnabled).toBe(true);
        });

        it('should have null timeout/interval IDs initially', () => {
            expect(State.checkIntervalId).toBeNull();
            expect(State.stopCheckTimeoutId).toBeNull();
            expect(State.pageRotationTimeoutId).toBeNull();
            expect(State.toastTimeoutId).toBeNull();
            expect(State.refreshTimeoutId).toBeNull();
        });

        it('should have null DOM references initially', () => {
            expect(State.videoWrapper).toBeNull();
            expect(State.videoPlayerWrapper).toBeNull();
            expect(State.originalParent).toBeNull();
            expect(State.originalIndex).toBeNull();
        });
    });

    describe('clear', () => {
        it('should clear checkIntervalId', () => {
            vi.useFakeTimers();
            State.checkIntervalId = setInterval(() => {}, 1000);

            State.clear();

            expect(State.checkIntervalId).toBeNull();
        });

        it('should clear stopCheckTimeoutId', () => {
            vi.useFakeTimers();
            State.stopCheckTimeoutId = setTimeout(() => {}, 1000);

            State.clear();

            expect(State.stopCheckTimeoutId).toBeNull();
        });

        it('should clear pageRotationTimeoutId', () => {
            vi.useFakeTimers();
            State.pageRotationTimeoutId = setTimeout(() => {}, 1000);

            State.clear();

            expect(State.pageRotationTimeoutId).toBeNull();
        });

        it('should clear toastTimeoutId', () => {
            vi.useFakeTimers();
            State.toastTimeoutId = setTimeout(() => {}, 1000);

            State.clear();

            expect(State.toastTimeoutId).toBeNull();
        });

        it('should handle already null IDs gracefully', () => {
            State.checkIntervalId = null;
            State.stopCheckTimeoutId = null;
            State.pageRotationTimeoutId = null;
            State.toastTimeoutId = null;

            expect(() => State.clear()).not.toThrow();
        });

        it('should clear multiple active timers at once', () => {
            vi.useFakeTimers();
            State.checkIntervalId = setInterval(() => {}, 1000);
            State.stopCheckTimeoutId = setTimeout(() => {}, 1000);
            State.pageRotationTimeoutId = setTimeout(() => {}, 1000);
            State.toastTimeoutId = setTimeout(() => {}, 1000);

            State.clear();

            expect(State.checkIntervalId).toBeNull();
            expect(State.stopCheckTimeoutId).toBeNull();
            expect(State.pageRotationTimeoutId).toBeNull();
            expect(State.toastTimeoutId).toBeNull();
        });
    });

    describe('mutable state', () => {
        it('should allow setting autoNavigationEnabled', () => {
            State.autoNavigationEnabled = false;
            expect(State.autoNavigationEnabled).toBe(false);

            State.autoNavigationEnabled = true;
            expect(State.autoNavigationEnabled).toBe(true);
        });

        it('should allow setting DOM references', () => {
            const mockWrapper = { id: 'mock-wrapper' };
            const mockPlayer = { id: 'mock-player' };

            State.videoWrapper = mockWrapper;
            State.videoPlayerWrapper = mockPlayer;

            expect(State.videoWrapper).toBe(mockWrapper);
            expect(State.videoPlayerWrapper).toBe(mockPlayer);
        });
    });
});
