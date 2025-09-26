import type { Character } from '../character/base.js';
import { MapSizeType } from '../map/config.js';
import { Map } from '../map/map.js';

export class MapManager {
    private maps: Map[] = [];
    private nextMapId: number = 0;

    constructor() {
        console.log("MapManager initialized.");
    }

    public createMap(size: MapSizeType): void {
        const map = new Map(this.nextMapId++, size);
        this.maps.push(map);
        map.visualize();
    }
    
    public sponCharacter(character: Character) {
        const map: Map | undefined = this.maps.find((candidate) => candidate.size === MapSizeType.Village);
        if (!map) {
            console.error("No map found for character spawn.");
            return;
        }
        character.setMapId(map.mapId);
        console.log(`Character spawned on map ${map.name}.`);
    }
}
