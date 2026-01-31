export const CONFIG = {
    PAGE_ROTATION_DELAY: 3 * 60 * 1000,
    DEBUG: false, // Set to true to enable debug logging
    // PAGE_ROTATION_DELAY: 10 * 1000, // 10 seconds, dev testing
    FULLSCREEN_BUTTON_WAIT_TIMEOUT: 60 * 1000,
    FULLSCREEN_BUTTON_CHECK_INTERVAL: 500,
    TOAST_DISPLAY_DURATION: 2000,
    DISABLED_PAGE_REFRESH_DELAY: 10 * 60 * 1000,

    OVERLAY_STYLES: {
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'z-index': '2147483647',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'background': '#000'
    },

    VIDEO_WRAPPER_STYLES: {
        // Force 16:9 aspect ratio while fitting within the viewport
        // width = min(100% of width, 16/9 of height)
        'width': 'min(100%, 177.78vh)',
        // height = min(100% of height, 9/16 of width)
        'height': 'min(100%, 56.25vw)',
        'position': 'relative',
        //'border': '1px solid red'
    },

    TOAST_STYLES: {
        'position': 'fixed',
        'left': '50%',
        'top': '24px',
        'transform': 'translateX(-50%)',
        'background': '#0f172a',
        'color': '#f8fafc',
        'padding': '14px 18px',
        'border-radius': '12px',
        'box-shadow': '0 4px 16px rgba(0, 0, 0, 0.25)',
        'font-family': 'Arial, sans-serif',
        'font-size': '16px',
        'opacity': '0',
        'transition': 'opacity 150ms ease-in-out',
        'pointer-events': 'none',
        'z-index': '2147483648'
    },

    SELECTORS: {
        VIDEO_PLAYER_WRAPPER: 'div[class*="CamPlayerKbygRewinds_playerWrapper"]',
        FULLSCREEN_BUTTON: 'button[class*="FullscreenControl_fullscreenControl"]',
        VIDEO_OVERLAY: '#video-overlay'
    }
};

export const STORAGE_KEYS = {
    LOCATION_GROUPS: 'surfloop-location-groups',
    SETTINGS: 'surfloop-settings'
};

// Default location groups used on first install
export const DEFAULT_LOCATION_GROUPS = [
    {
        id: 'sf-bay',
        name: 'SF Bay',
        spots: [
            {
                id: 'linda-mar-north',
                name: 'Linda Mar North',
                url: 'https://www.surfline.com/surf-report/linda-mar-north/5cbf8d85e7b15800014909e8?camId=58349ea8e411dc743a5d52c7'
            },
            {
                id: 'south-ocean-beach',
                name: 'South Ocean Beach',
                url: 'https://www.surfline.com/surf-report/south-ocean-beach/5842041f4e65fad6a77087f9?camId=615dd986de7d8059b38a053f'
            },
            {
                id: 'pleasure-point',
                name: 'Pleasure Point',
                url: 'https://www.surfline.com/surf-report/pleasure-point/5842041f4e65fad6a7708807?camId=5cf0124c4f41df57b971a9a4'
            },
            {
                id: 'cowells',
                name: 'Cowells',
                url: 'https://www.surfline.com/surf-report/cowells/5842041f4e65fad6a7708806?camId=583497a03421b20545c4b532'
            },
            {
                id: 'steamer-lane',
                name: 'Steamer Lane',
                url: 'https://www.surfline.com/surf-report/steamer-lane/5842041f4e65fad6a7708805?camId=63726f8a5cd4988578c5179b'
            },
            {
                id: 'mavericks',
                name: "Maverick's",
                url: 'https://www.surfline.com/surf-report/maverick-s/5842041f4e65fad6a7708801?camId=60957ad32272016445d45b2c'
            },
            {
                id: 'half-moon-bay',
                name: 'Half Moon Bay',
                url: 'https://www.surfline.com/surf-report/half-moon-bay/5842041f4e65fad6a770896f'
            }
        ]
    },
    {
        id: 'oahu',
        name: 'Oahu',
        spots: [
            {
                id: 'pipeline',
                name: 'Pipeline',
                url: 'https://www.surfline.com/surf-report/pipeline/5842041f4e65fad6a7708890?camId=58349ef6e411dc743a5d52cc'
            },
            {
                id: 'waikiki-beach',
                name: 'Waikiki Beach',
                url: 'https://www.surfline.com/surf-report/waikiki-beach/584204204e65fad6a7709148?camId=5d24cc0b3ea3012c99da7808'
            },
            {
                id: 'laniakea',
                name: 'Laniakea',
                url: 'https://www.surfline.com/surf-report/laniakea/5842041f4e65fad6a7708898?camId=58349bb9e411dc743a5d52a6'
            },
            {
                id: 'honolua-bay',
                name: 'Honolua Bay',
                url: 'https://www.surfline.com/surf-report/honolua-bay/5842041f4e65fad6a7708897?camId=58349946e411dc743a5d52b0'
            }
        ]
    }
];
