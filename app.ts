import http from 'http';
import dotenv from 'dotenv'
import { EventDto } from './api/event.dto'
import { 
  GetProviderUseCase, 
  SaveEventUseCase, 
  PublishEventUseCase 
} from './usecase/event.usecase'
import { EventProvider } from './api/event.provider';
import { Database } from './dao/database';
import { DynamoDBDatabase } from './dao/dynamo.database';
import { PubSub } from './sns/pub-sub';
import { SnsPubSub } from './sns/sns.pub-sub';
import { EventRepositoryCommandImpl } from './dao/event.repository.comand';
import { EventPublisherImpl } from './sns/event.publisher';

dotenv.config()

const port = process.env.PORT || 4000;
const database: Database = new DynamoDBDatabase(process.env.DYNAMO_TABLE_NAME)
const pubsub: PubSub = new SnsPubSub(process.env.SNS_TOPIC_NAME)

const app = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const data = JSON.parse(Buffer.concat(buffers).toString("utf-8")) as EventDto
  console.log(data);

  const provider = GetProviderUseCase(data)
  if (provider != EventProvider.None) {
    await SaveEventUseCase(database, new EventRepositoryCommandImpl(), data)
    await PublishEventUseCase(pubsub, new EventPublisherImpl(), data, provider)
  }

  res.end();
})


app.listen(port, function(){
  console.log(`App listening at http://localhost:${port}`);
});
