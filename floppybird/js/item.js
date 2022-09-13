class Item {
    constructor() {
        this.ITEM_NONE = 0;
        this.ITEM_COIN = 1;
        this.ITEM_RED_BOTTLE = 2;
        this.ITEM_PINK_BOTTLE = 3;
        this.ITEM_SHIELD = 4;

        this._items = [];
    }

    init() {
        this._items = [[0, 0, 0]];
    }

    item() {
        return this._items;
    }

    pop() {
        this._items.splice(0, 1);
    }

    move(speed = 1) {
        printf("[Item] ", "Speed:" + speed);

        for (let i = 0; i < this._items.length; i++) {
            this._items[i][0] -= speed;
        }
    }

    make_new_item(px, top, down) {
        let item_y = top + Math.floor((9 - top - down) / 2);
        if (getRandomInt(0, 10) < 6) {
            this._items.push([-1, item_y, this.ITEM_NONE]);
            return;
        }

        let next_item_value = getRandomInt(0, 100);
        let item_type = this.ITEM_NONE;
        if (next_item_value < 10) {
            item_type = this.ITEM_RED_BOTTLE;
        } else if (next_item_value < 20) {
            item_type = this.ITEM_SHIELD;
        } else if (next_item_value < 40) {
            item_type = this.ITEM_PINK_BOTTLE;
        } else {
            item_type = this.ITEM_COIN;
        }

        let item_x = item_type !== this.ITEM_NONE ? px : -1;
        this._items.push([item_x, item_y, item_type]);
    }

    removeFirstItem() {
        this._items[0][0] = -1;
    }
}