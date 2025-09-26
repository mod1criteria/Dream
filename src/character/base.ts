export type CharacterPosition = {
    x: number;
    y: number;
};

export class Character {
    private id: number;
    private mapId: number | null = null;
    private name: string;
    private position: CharacterPosition | null = null;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        console.log(`Character ${this.id} created.`);
    }

    public getId(): number {
        return this.id;
    }

    public setMapId(mapId: number): void {
        this.mapId = mapId;
        console.log(`Character ${this.id} assigned to map ${this.mapId}.`);
    }

    public setPosition(position: CharacterPosition): void {
        this.position = position;
        console.log(`Character ${this.id} positioned at (${position.x}, ${position.y}).`);
    }

    public getPosition(): CharacterPosition | null {
        return this.position;
    }

    public Play(): void {
        const pos = this.position ? `(${this.position.x}, ${this.position.y})` : 'unknown position';
        console.log(`Character ${this.id} ${this.name} is playing its turn at ${pos}.`);
    }
}
