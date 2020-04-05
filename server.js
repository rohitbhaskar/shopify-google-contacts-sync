require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
//const cors = require('@koa/cors');
const Router = require('@koa/router');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

const google = require('./google');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

const server = new Koa();
//server.use(cors({origin: '*'}));
//server.use(cors());
const router = new Router();

// router.use(function *(){
//   this.set('Access-Control-Allow-Origin', '*');
//   });

app.prepare().then(() => {
  
  server.use(session({ secure: true, sameSite: 'none' }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products'],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;

        ctx.redirect('/');
      },
    }),
  );

  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
  });

  //server.use(router.allowedMethods());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});


// Handling server endpoints
router.get('/google', (ctx, next) => {
  console.log("get request on /google/connect: ", ctx.request.query);
  google.auth(ctx);
})
router.get('/auth/google/callback', (ctx, next) => {
  console.log("get request on /google/connect: ", ctx.request.query);
  google.authCallback(ctx);
})

// router.get('/', ctx => {
// });

server.use(router.routes());
server.use(router.allowedMethods());