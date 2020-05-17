const Router = require('@koa/router');
const router = new Router();
const Google = require('../helpers/google');

const _google = new Google();


router.get('/google', (ctx, next) => {
    console.log("get request on /google/connect: ", ctx.request.query);
    // console.log(ctx)
    _google.auth(ctx);
})
router.get('/auth/google/callback', (ctx, next) => {
    console.log("get request on /google/callback: ", ctx.request.query);
    //console.log(ctx);
    _google.authCallback(ctx);
});

module.exports = router ;
    