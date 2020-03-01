import { TeamConfiguration } from './TeamConfiguration';
import { CharacterNormal } from '@src/Character';
import { Game } from '@src/Game';
import { UUID } from '@src/Common';

/**
 * 队伍(平常状态)
 */
export class TeamNormal implements UUID {
    /**队伍名称 */
    name: string;
    /**队伍id */
    uuid: symbol;
    /**队伍成员 */
    members: Array<CharacterNormal>;
    constructor(data: Array<CharacterNormal>, game: Game);
    constructor(data: TeamConfiguration, game: Game);
    constructor(data: TeamConfiguration | Array<CharacterNormal>, game: Game) {
        this.uuid = Symbol('TeamNormal');
        if (Array.isArray(data)) {
            this.name = '玩家队伍';
            this.members = data;
            return;
        }
        this.name = data.name;
        this.members = data.members.map((eachMember) => {
            let character;
            if ('properties' in eachMember) {
                //配置
                character = new CharacterNormal(eachMember);
            } else {
                //id
                character = game.characterCenter.getCharacter(eachMember.id);
            }
            eachMember.level && character.setLevel(eachMember.level);
            return character;
        });
    }
}
