class Storage {
    get (key) {
        const storage = localStorage.getItem(key)
            ? JSON.parse(localStorage.getItem(key))
            : null;
        const timestamp = Math.floor(Date.now() / 1000);

        if (!storage) return null;

        const {value, expire} = storage;

        if (expire <= timestamp) {
            this.del(key);

            return null;
        }

        return value || null;
    }

    set (key, value, expire = 0) {
        const storage = {};

        storage[key] = value;

        if (expire) {
            storage.expire = Math.floor(Date.now() / 1000) + expire;
        }

        localStorage.setItem(key, JSON.stringify(storage));
    }

    del (key) {
        console.log('delete');

        localStorage.removeItem(key);
    }

    clear () {
        localStorage.clear();
    }
}

export default new Storage();
