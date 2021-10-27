import http from 'http';
import dotenv from 'dotenv'

import { Database } from './dao/database';
import { DynamoDBDatabase } from './dao/dynamo.database';
import { PubSub } from './sns/pub-sub';
import { SnsPubSub } from './sns/sns.pub-sub';

import { EventDto } from './api/event.dto'
import { EventProvider } from './api/event.provider';
import { EventRepositoryImpl } from './dao/event.repository';
import { EventPublisherImpl } from './sns/event.publisher';

import { 
  GetProviderUseCase, 
  SaveEventUseCase, 
  PublishEventUseCase 
} from './usecase/event.usecase'

dotenv.config()

const port = process.env.PORT
const database: Database = new DynamoDBDatabase(process.env.DYNAMO_TABLE_NAME ?? "")
const pubsub: PubSub = new SnsPubSub(process.env.SNS_ARN_TOPIC_NAME ?? "")

const app = http.createServer(async (req, res) => {
  const buffers : any[] = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const data = JSON.parse(Buffer.concat(buffers).toString("utf-8")) as EventDto
  console.log(data);

  const provider = GetProviderUseCase(data.signature)
  if (provider != EventProvider.NONE) {
    await SaveEventUseCase(database, new EventRepositoryImpl(), data)
    await PublishEventUseCase(pubsub, new EventPublisherImpl(), data, provider)
  }

  res.end();
})


app.listen(port, function(){
  console.log(`App listening at http://localhost:${port}`);
});