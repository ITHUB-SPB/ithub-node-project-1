export class SlotValueError extends TypeError {
    constructor(message: string | undefined) {
        super(`Value must be a Timeslot ${message ? message : ''}`);
    }
}

export class SlotRelationError extends RangeError {
    constructor(start: Date, end: Date) {
        const localeStart = start.toLocaleString('ru');
        const localeEnd = end.toLocaleString('ru');

        super(
            `Value of start (${localeStart}) must be less than end (${localeEnd})`,
        );
    }
}

export class Timeslot {
    #start: Date;
    #end: Date;

    constructor(start: Date, end: Date) {
        this.#start = this.setStart(start);
        this.#end = this.setEnd(end);
    }

    #isDate(value: any) {
        return value instanceof Date;
    }

    static isIntersect(timeslot: any, otherTimeslot: any) {
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

    get isAM() {
        return this.#end.getHours() < 12;
    }

    get isPM() {
        return this.#start.getHours() >= 12;
    }

    setStart(newDate: any) {
        if (!this.#isDate(newDate)) {
            throw new TypeError('Value must be a Time');
        }

        if (this.#end && newDate >= this.#end) {
            throw new SlotRelationError(newDate, this.#end);
        }

        return newDate;
    }

    set start(newDate) {
        this.setStart(newDate);
    }

    setEnd(newDate: any) {
        if (!this.#isDate(newDate)) {
            throw new TypeError('Value must be a Time');
        }

        if (newDate <= this.#start) {
            throw new SlotRelationError(this.#start, newDate);
        }

        return newDate;
    }

    set end(newDate) {
        this.setEnd(newDate);
    }

    toMapped() {
    return {
        start: this.#start.valueOf() / 1000,
        end: this.#end.valueOf() / 1000,
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

    static fromJSON(data: string) {
        return this.fromMapped(JSON.parse(data));
    }

    static fromMapped({ start, end }: {
        start: number,
        end: number
    }) {
        return new this(new Date(start * 1000), new Date(end * 1000));
    }
}
