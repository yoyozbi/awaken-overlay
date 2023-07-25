import type { Teams } from './Team.type';

export interface Game {
	arena: string;
	ball: { location: { x: number; y: number; z: number }; speed: number; team: number };
	hasTarget: boolean;
	hasWinner: boolean;
	isOT: boolean;
	isReplay: boolean;
	isSingleParty: boolean;
	series: number;
	target: string;
	teams: Teams;
	time_milliseconds: number;
	time_seconds: number;
	winner: string;
}
