require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
// const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks');
//const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const googleAuth = require('./server/configurations/googleAuth');
const googleContacts = require('./server/helpers/googleContacts');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 5000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST } = process.env;

const server = new Koa();
const router = require('./routes/routes');
const koaRouter = new Router();

// Initialize Google Auth Client
googleAuth.setAuthClient();


app.prepare().then(() => {
  
  server.use(session({ secure: true, sameSite: 'none' }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];
  
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_orders', 'write_orders'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        console.log('We did it!', accessToken);

        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

        const registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/create`,
          topic: 'ORDERS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
     
        if (registration.success) {
          console.log('Successfully registered webhook!');
        } else {
          console.log('Failed to register webhook', registration.result);
        }

        //await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect('/');
      }
    }),
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.post('/webhooks/orders/create', webhook, (ctx) => {
    // console.log('received webhook: ', ctx.state.webhook);
    googleContacts.createContact(ctx.state.webhook);
  });

  koaRouter.get('*', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(koaRouter.allowedMethods());
  server.use(koaRouter.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

server.use(router.routes());
server.use(router.allowedMethods());