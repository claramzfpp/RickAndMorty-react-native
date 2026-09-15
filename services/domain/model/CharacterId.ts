export class CharacterId {
    readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error(`Invalid CharacterId: ${value}`);
        }

        this.value = value;
    }

    equals(other: CharacterId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value.toString();
    }
}
