import type ICalendarsSyncService from './ICalendarsSyncService';
import { injectable, inject } from 'inversify';
import ILoggerService from '../discord/ILoggerService';
import { TYPES } from '../../types';
import Bree from "bree";

@injectable()
export default class CalendarsSyncService implements ICalendarsSyncService {

	public constructor(@inject(TYPES.LoggerService) loggerService: ILoggerService) {

	}
}
