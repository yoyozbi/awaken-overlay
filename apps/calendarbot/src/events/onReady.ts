import { Client, REST, Routes } from "discord.js";
import { CommandList } from "../commands/_CommandList";

export const onReady = async (bot: Client) => {
  console.log(`Ready! Logged in as ${bot.user?.tag}`)

  if(!bot.user)
  {
    console.error("No user when bot ready");
    return;
  }


  // Registering commands
  const commandData = CommandList.map(command => command.data.toJSON());
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  try 
  {
    console.log(`Started refreshing ${commandData.length} application commmands`);

    await rest.put(
      Routes.applicationCommands(bot.user.id), 
      {body: commandData}
    );

    console.log("Successfully reloaded application commands");
  }
  catch(error)
  {
    console.error(error);
  }
}
