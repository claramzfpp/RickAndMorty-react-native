export class EpisodeId {
    readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error(`Invalid EpisodeId: ${value}`);
        }

        this.value = value;
    }

    equals(other: EpisodeId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value.toString();
    }
}
