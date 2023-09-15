const TYPES = {
  // Discord
  Commands: Symbol.for("Commands"),
  Events: Symbol.for("Events"),
  ClientService: Symbol.for("ClientService"),
  LoggerService: Symbol.for("LoggerService"),
  discord: Symbol.for("discord"),

  // DB
  DBService: Symbol.for("DBService"),
  CalendarService: Symbol.for("CalendarService")
}

export { TYPES }
