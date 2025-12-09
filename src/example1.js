class SlotRelationError extends Error {
    constructor(start, end) {
        const localeStart = start.toLocaleString('ru')
        const localeEnd = end.toLocaleString('ru')
        super(`Value of start (${localeStart}) must be < than end (${localeEnd})`)
    }
}

class DateValueError extends TypeError {
    constructor() {
        super("Value must be type of Date")
    }
}

class Slot {
    #start
    #end

    constructor(start, end) {
        this.setStart(start)
        this.setEnd(end)
    }

    #checkValue(value) {
        if (!(value instanceof Date)) {
            throw new DateValueError()
        }
    }

    getStart() {
        return this.#start
    }

    getEnd() {
        return this.#end
    }

    get start() {
        return this.#start
    }

    get end() {
        return this.#end
    }

    set start(value) {
        this.setStart(value)
    }

    set end(value) {
        this.setEnd(value)
    }

    setStart(start) {
        this.#checkValue(start)

        if (this.#end && (start > this.#end)) {
            throw new SlotRelationError(start, this.#end)
        }

        this.#start = start
    }

    setEnd(end) {
        this.#checkValue(end)

        if (this.#start && (end < this.#start)) {
            throw new SlotRelationError(this.#start, end)
        }

        this.#end = end
    }

    static fromJSON(jsonString) {
        const jsonData = JSON.parse(jsonString)
        return new this(new Date(jsonData.start * 1000), new Date(jsonData.end * 1000))
    }

    static fromObject(slotPlainObject) {
        return new this(slotPlainObject.start, slotPlainObject.end)
    }

    toString() {
        return {
            start: this.#start.toLocaleString('ru'),
            end: this.#end.toLocaleString('ru')
        }
    }

    toObject() {
        return {
            start: Number(this.#start) / 1000,
            end: Number(this.#end) / 1000
        }
    }
}

const slot1 = new Slot(new Date(2025, 11, 8, 11), new Date(2025, 11, 8, 12))
console.log(slot1.toString(), slot1.toObject())
console.log(slot1.getStart(), slot1.getEnd())

console.log(slot1.start, slot1.end)
slot1.start = new Date()
console.log(slot1.start, slot1.getEnd())
