import {Telegraf, Context as TelegrafContext} from 'telegraf';
import {MenuTemplate, MenuMiddleware} from 'telegraf-inline-menu'
import Database from '../api/middlewares/database'
import config from '../config';
import { Container } from 'typedi';

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:R@duga12@telegram.zqx1v.mongodb.net/Telegram?retryWrites=true&w=majority";

export default class TelegramBotService {
  public async LaunchBotService(app) {
    const bot = new Telegraf(config.telegram.token)

    const databaseInstance = Container.get(Database);
    const users = await databaseInstance.getUsers();

    console.log("USERS IN BASE: " + users)

    bot.start((ctx) => this.checkUserStatus(ctx, bot))
    bot.launch()

    return { delivered: 1, status: 'ok' }
  }

  public registerUser(telegram, bot) {
    console.log("Register")

    const menu = new MenuTemplate<TelegrafContext>(() => `Эй! Я тебя не знаю!`)

    menu.interact('Зарегестрироваться!', 'a', {
      do: async ctx => {
        await ctx.reply('Как мне тебя называть?')
        bot.on('message', (ctx) =>  {
          this.saveUser(ctx)
          ctx.reply(`Приятно познакомиться, ${ctx.message.text}!`)
        })
        return false
      }
    })

    const menuMiddleware = new MenuMiddleware('/', menu)
    menuMiddleware.replyToContext(telegram)
    bot.use(menuMiddleware)

    bot.launch()
  }

  public saveUser(ctx) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const user = {id: ctx.message.from.id, name: ctx.message.text}

    client.connect(err => {
      const collection = client.db("test").collection("users");
      collection.insertOne(user, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        client.close();
      });
      client.close();
    });
  }

  public checkUserStatus(telegram, bot) {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
      const collection = client.db("test").collection("users");
      console.log("GOT HERE")
      var users = collection.find({}, { projection: { _id: 0, id: 1, name: 1 } }).toArray(function(err, result) {
        if (err) throw err;
        var users = result
        console.log("THIS IS A USER: " + users);
        return users
      });

      console.log("Users2 " + users)

      var found = false;

      for(var i = 0; i < users.length; i++) {
        if (users[i].id == telegram.message.from.id) {
            found = true;
            telegram.reply(`Привет, ${users[i].name}!`)
            break;
        }
      }
  
      if (found == false) {
        console.log(users)
        this.registerUser(telegram, bot)
      }
    });
  }
}
