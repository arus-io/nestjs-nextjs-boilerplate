require('./modules/infra/config/_loadEnvironment');

const { parse } = require('url');
const next = require('next');
const express = require('express');
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev: true, dir: './client' });
const handle = app.getRequestHandler();

const server = express();
server.use((req, res, next) => {
  req.subdomain = req.subdomains[0];
  next();
});

server.use(express.static(path.join(__dirname, '..', 'static')));

app.prepare().then(() => {
  server.use((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (req.subdomain === 'admin') {
      app.render(req, res, `/admin${pathname === '/' ? '' : pathname}`, query);
    } else {
      handle(req, res, parsedUrl);
    }
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
