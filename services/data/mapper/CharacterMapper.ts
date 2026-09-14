import { Character } from '../../domain/model/Character';
import { RMCharacter } from '../remote/characters/RMCharacter';

export class CharacterMapper {
    static toCharacter(rmCharacter: RMCharacter): Character {
        return {
            id: rmCharacter.id,
            name: rmCharacter.name,
            status: rmCharacter.status,
            species: rmCharacter.species,
            origin: rmCharacter.origin.name,
            image: rmCharacter.image,
            gender: rmCharacter.gender
        };
    }
}
