class Slot {
    #end

    static errorMessages = {
        valueType: "Value must be type of Date",
        valueStart: "Value of start must be < than end",
        valueEnd: "Value of end must be > than start"
    }

    constructor(start, end) {
        this.setStart(start)
        this.setEnd(end)
    }

    checkValue(value) {
        if (!(value instanceof Date)) {
            throw new Error(Slot.errorMessages.valueType)
        }
    }

    setStart(start) {
        this.checkValue(start)

        if (this.#end && (start > this.#end)) {
            throw new Error(Slot.errorMessages.valueStart)
        }

        this._start = start
    }

    setEnd(end) {
        this.checkValue(end)

        if (this._start && (end < this._start)) {
            throw new Error(Slot.errorMessages.valueEnd)
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
}

const slot1 = new Slot(new Date(2025, 11, 8, 12), new Date(2025, 11, 8, 13))
console.log(slot1)
slot1.setStart(new Date())

const slot2json = '{ "start": 176503030, "end": 178503040 }'
const slot2 = Slot.fromJSON(slot2json)
console.log(slot2)

const slot3object = {
    start: new Date(2025, 11, 9, 10),
    end: new Date(2025, 11, 9, 11)
}
const slot3 = Slot.fromObject(slot3object)
console.log(slot3)

console.log(slot3._start)
slot3._start = null
slot3.setEnd(new Date())
console.log(slot3)

// TODO getМетоды для start, end
// TODO переход к get set для start, end
