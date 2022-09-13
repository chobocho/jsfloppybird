class Energy {
    constructor() {
        this._energy = 100;
    }

    init() {
        this._energy = 100;
    }

    energy() {
        return this._energy;
    }

    increase(value) {
        this._energy += value;
        this._energy = this._energy > 100 ? 100 : this._energy;
    }

    decrease(value) {
        this._energy -= value;
        this._energy = this._energy < 0 ? 0 : this._energy;
    }
}