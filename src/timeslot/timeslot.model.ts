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
    #id: number;
    #start: Date;
    #end: Date;

    constructor(start: Date, end: Date, id: number) {
        this.#id = id;
        this.#start = start;
        this.#end = end;
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

    get AM() {
        const hours = this.#end.getHours();
        const minutes = this.#end.getMinutes();
        return hours < 12 || (hours === 12 && minutes === 0);
    }

    get PM() {
        return this.#start.getHours() >= 12;
    }

    toMapped() {
        return {
            id: this.#id,
            start: Math.floor(this.#start.getTime() / 1000),
            end: Math.floor(this.#end.getTime() / 1000),
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

    static fromMapped({
        id,
        start,
        end,
    }: {
        id: number;
        start: number;
        end: number;
    }) {
        return new this(new Date(start * 1000), new Date(end * 1000), id);
    }
}
