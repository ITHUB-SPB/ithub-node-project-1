export class SlotValueError extends TypeError {
    constructor(message) {
        super(`Value must be a Timeslot ${message ? message : ''}`);
    }
}

export class SlotRelationError extends RangeError {
    constructor(start, end) {
        const localeStart = start.toLocaleString('ru');
        const localeEnd = end.toLocaleString('ru');

        super(
            `Value of start (${localeStart}) must be less than end (${localeEnd})`,
        );
    }
}
 
export class Timeslot {
    #start;
    #end;

    constructor(start, end) {
        this.setStart(start);
        this.setEnd(end);
    }

    #isDate(value) {
        return value instanceof Date;
    }

    static isIntersect(timeslot, otherTimeslot) {
        if (!(timeslot instanceof Timeslot)) {
            throw new SlotValueError(timeslot.toString());
        }

        if (!(otherTimeslot instanceof Timeslot)) {
            throw new SlotValueError(otherTimeslot.toString());
        }

        return (
            (otherTimeslot.start > timeslot.start &&
                otherTimeslot.end < timeslot.end) ||
            (otherTimeslot.start < timeslot.start &&
                otherTimeslot.end > timeslot.start)
        );
    }

    getStart() {
        return this.#start;
    }

    get start() {
        return this.#start;
    }

    getEnd() {
        return this.#end;
    }

    get end() {
        return this.#end; // либо this.getEnd()
    }

    setStart(newDate) {
        if (!this.#isDate(newDate)) {
            throw new TypeError('Value must be a Time');
        }

        if (this.#end && newDate >= this.#end) {
            throw new SlotRelationError(newDate, this.#end);
        }

        this.#start = newDate;
    }

    set start(newDate) {
        this.setStart(newDate);
    }

    setEnd(newDate) {
        if (!this.#isDate(newDate)) {
            throw new TypeError('Value must be a Time');
        }

        if (newDate <= this.#start) {
            throw new SlotRelationError(this.#start, newDate);
        }

        this.#end = newDate;
    }

    set end(newDate) {
        this.setEnd(newDate);
    }

    toMapped() {
        return {
            start: this.#start / 1000,
            end: this.#start / 1000,
        };
    }

    toString() {
        return {
            start: this.#start.toLocaleString('ru'),
            end: this.#end.toLocaleString('ru'),
        };
    }

    toJSON() {
        return JSON.stringify(this.toMapped());
    }

    static fromJSON(data) {
        return this.fromMapped(JSON.parse(data));
    }

    static fromMapped(data) {
        const { start, end } = data;
        return new this(new Date(start * 1000), new Date(end * 1000));
    }
}
