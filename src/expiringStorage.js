window.tempStorage = null;

// Does this browser support localStorage?
try {
    window.tempStorage = window.localStorage;
} catch (e) {}

// Does this browser support sessionStorage?
try {
    if (!window.tempStorage) window.tempStorage = window.sessionStorage;
} catch (e) {
    window.localStorage = window.tempStorage;
}

class ExpiringStorage {
    get(key) {
        if (localStorage) {
            const cached = JSON.parse(
                localStorage.getItem(key)
            );

            if (! cached) {
                return null;
            }

            const expires = new Date(cached.expires);

            if (expires < new Date()) {
                localStorage.removeItem(key);
                return null;
            }

            return cached.value;
        } else {
            return null;
        }
    }

    set(key, value, lifeTimeInMinutes) {
        if (localStorage) {
            const currentTime = new Date().getTime();

            const expires = new Date(currentTime + lifeTimeInMinutes * 60000);

            localStorage.setItem(key, JSON.stringify({ value, expires }));
        }
    }
}

export default new ExpiringStorage();
