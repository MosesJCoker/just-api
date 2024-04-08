import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {cors} from 'hono/cors'
import { ContextSDK } from "@context-labs/sdk";


const app = new Hono()
const context = new ContextSDK({});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/', cors({
  credentials: true,
  origin: [
    'http://localhost:5173'
  ]
}), async (c)=> {
  console.log('endpoint hit');

  const {query} = await c.req.json();

  console.log('getting response for query:', query);
  const answer = await fetchAnswers(query);
  console.log({answer});
  return c.json({answer});
   
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})


async function fetchAnswers(query: string) {
  return  new Promise((resolve, reject) => {
    context.query({
      botId: 'QCz7GPWiL',
      query,
      onComplete: (data) => {
        resolve(data.output);
      },
      onError: (error) => {
        console.error(error);
        reject(error);
      }
  
    })
  })
}