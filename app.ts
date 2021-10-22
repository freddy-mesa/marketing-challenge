import http from 'http';

const port = 4000;

const app = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const data = JSON.parse(Buffer.concat(buffers).toString());

  console.log(data);

  res.end();
})


app.listen(port, function(){
  console.log(`App listening at http://localhost:${port}`);
});
