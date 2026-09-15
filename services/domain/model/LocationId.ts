export class LocationId {
    readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error(`Invalid LocationId: ${value}`);
        }

        this.value = value;
    }

    equals(other: LocationId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value.toString();
    }
}
