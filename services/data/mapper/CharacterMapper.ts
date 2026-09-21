import { Character, CharacterStatus } from '../../domain/model/Character';
import { CharacterId } from '../../domain/model/CharacterId';
import { RMCharacter } from '../remote/characters/RMCharacter';

export class CharacterMapper {
    static toDomain(rmCharacter: RMCharacter): Character {
        return {
            id: new CharacterId(rmCharacter.id),
            name: rmCharacter.name,
            status: rmCharacter.status as CharacterStatus,
            species: rmCharacter.species,
            origin: rmCharacter.origin.name,
            image: rmCharacter.image,
            gender: rmCharacter.gender
        };
    }
}
