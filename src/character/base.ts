export class Character {
    private id: number;
    private mapId: number|null = null;
    private name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        console.log(`Character ${this.id} created.`);
    }

    public setMapId(mapId: number): void {
        this.mapId = mapId;
        console.log(`Character ${this.id} assigned to map ${this.mapId}.`);
    }

    public Play(): void {
        console.log(`Character ${this.id} ${this.name} is playing its turn.`);
    }
}
