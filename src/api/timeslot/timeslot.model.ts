export class InvalidSlotError extends TypeError {
    constructor(value: unknown) {
      super(`Значение должно быть экземпляром Timeslot, получено: ${typeof value}`);
    }
  }
  
  export class TimeRelationError extends RangeError {
    constructor(start: Date, end: Date) {
      const formattedStart = start.toLocaleTimeString("ru");
      const formattedEnd = end.toLocaleTimeString("ru");
      super(`Время начала (${formattedStart}) должно быть меньше времени окончания (${formattedEnd})`);
    }
  }
  
  export class Timeslot {
    #startTime: Date;
    #endTime: Date;
  
    constructor(start: Date, end: Date) {
      this.#startTime = this.validateAndSetStart(start);
      this.#endTime = this.validateAndSetEnd(end);
    }
  
    private isValidDate(value: unknown): value is Date {
      return value instanceof Date && !isNaN(value.getTime());
    }
  
    static isOverlap(slotA: Timeslot, slotB: Timeslot): boolean {
      if (!(slotA instanceof Timeslot)) throw new InvalidSlotError(slotA);
      if (!(slotB instanceof Timeslot)) throw new InvalidSlotError(slotB);
  
      return slotA.startTime < slotB.endTime && slotB.startTime < slotA.endTime;
    }
  
    get startTime(): Date {
      return this.#startTime;
    }
  
    get endTime(): Date {
      return this.#endTime;
    }
  
    get isMorning(): boolean {
      return this.#endTime.getHours() <= 12;
    }
  
    get isAfternoon(): boolean {
      return this.#startTime.getHours() >= 12;
    }
  
    private validateAndSetStart(date: Date): Date {
      if (!this.isValidDate(date)) {
        throw new TypeError("Значение должно быть корректной датой");
      }
      if (this.#endTime && date >= this.#endTime) {
        throw new TimeRelationError(date, this.#endTime);
      }
      return date;
    }
  
    private validateAndSetEnd(date: Date): Date {
      if (!this.isValidDate(date)) {
        throw new TypeError("Значение должно быть корректной датой");
      }
      if (date <= this.#startTime) {
        throw new TimeRelationError(this.#startTime, date);
      }
      return date;
    }
  
    set startTime(date: Date) {
      this.#startTime = this.validateAndSetStart(date);
    }
  
    set endTime(date: Date) {
      this.#endTime = this.validateAndSetEnd(date);
    }
  
    toSerialized(): { start: number; end: number } {
      return {
        start: Math.floor(this.#startTime.valueOf() / 1000),
        end: Math.floor(this.#endTime.valueOf() / 1000),
      };
    }
  
    toFormatted(): { start: string; end: string } {
      return {
        start: this.#startTime.toLocaleString("ru"),
        end: this.#endTime.toLocaleString("ru"),
      };
    }
  
    toJSON(): string {
      return JSON.stringify(this.toSerialized());
    }
  
    static fromJSON(json: string): Timeslot {
      return this.fromSerialized(JSON.parse(json));
    }
  
    static fromSerialized({ start, end }: { start: number; end: number }): Timeslot {
      return new Timeslot(new Date(start * 1000), new Date(end * 1000));
    }
  }