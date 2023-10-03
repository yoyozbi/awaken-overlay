import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import "./utils/EnvValidation"
import { container } from "./container";
import { TYPES } from "./types";
import type IClientService from "./services/discord/IClientService";

const client = container.get<IClientService>(TYPES.ClientService);

client.login();
