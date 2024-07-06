class Cache {
    constructor() {
        this.cache = {};
        this.expiryTime = 300000; // 5 minutes in milliseconds
    }

    get(key) {
        const entry = this.cache[key];
        if (entry && (Date.now() - entry.time < this.expiryTime)) {
            return entry.value;
        }
        return null;
    }

    set(key, value) {
        this.cache[key] = {
            value: value,
            time: Date.now()
        };
    }
}

module.exports = { Cache };
