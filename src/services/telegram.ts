import {Telegraf} from 'telegraf';
import fetch from 'node-fetch'
import schedule from 'node-schedule';

export default class TelegramBotService {

  public async LaunchBotService(app) {
    let covidData = []
    covidData = await fetch('https://api.covid19api.com/total/country/cyprus')
      .then(response => response.json())
      .then(data => {return data});

    var casesToday = covidData[covidData.length - 1].Confirmed - covidData[covidData.length - 2].Confirmed
    var newData = covidData[covidData.length - 1]

    const bot = new Telegraf(process.env.BOT_TOKEN)
    bot.start((ctx) => {
      ctx.reply(`Hey!\nWelcome to the bot, I will be sending you Covid data related to Cyprus, everyday at 9:00\n\nHere is your first update:`)
      ctx.reply(`New Cases: ${casesToday}\nTotal Cases: ${newData.Confirmed}`)
      this.sendData(ctx)
    })
    bot.launch()
  }

  public async sendData(ctx) {
    await schedule.scheduleJob('9 * * *', async function(){
      let covidData = []
      covidData = await fetch('https://api.covid19api.com/total/country/cyprus')
        .then(response => response.json())
        .then(data => {return data});

      var casesToday = covidData[covidData.length - 1].Confirmed - covidData[covidData.length - 2].Confirmed
      var newData = covidData[covidData.length - 1]

      ctx.reply(`New Cases: ${casesToday}\nTotal Cases: ${newData.Confirmed}`)
    });
  }
}
