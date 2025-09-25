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
        this.maps.push(new Map(this.nextMapId++, size));
    }
    
    public sponCharacter(character: Character) {
        let map: Map | undefined = this.maps.find(map => map.size === MapSizeType.Village); // 추 후 스폰 맵 찾는 로직 구현
        if(!map) {
            console.error("No map found for character spawn.");
            return;
        }
        // 맵에 캐릭터 스폰 로직 구현
        character.setMapId(map.mapId);
        console.log(`Character spawned on map ${map.name}.`);
    }
}
