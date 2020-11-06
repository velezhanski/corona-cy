import express from 'express';
import bcrypt from 'bcrypt';
import { Container } from 'typedi';
import TelegramBotService from './services/telegram'
import config from './config';

async function startServer() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(config.port, () => { 
    console.log(`Server running on port ${config.port}`);
  });

  const users = []

  app.get('/users', (req, res) => {
    res.json(users)
  })

  app.post('/users', async (req, res) => {
    try {
      console.log(req.body)
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = {name: req.body.name, password: hashedPassword}
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })

  const telegramBotServiceInstance = Container.get(TelegramBotService);
  telegramBotServiceInstance.LaunchBotService(app);
}

startServer();
