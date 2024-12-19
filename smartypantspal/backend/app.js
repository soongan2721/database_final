// var {RedisStore, redisClient} = require('./redis')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./src/server/routes/index'); //引入 routes下的index.js 並宣告為變數 indexRouter
var usersRouter = require('./src/server/routes/users');
var api = require('./src/server/routes/article.route');
const session = require('express-session');
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require('./swagger-output.json');
// const RedisStore = require("connect-redis").default
// const redis = require('redis');
// var imgupload = require('./routes/imgupload');
var app = express();
const cookieParser = require('cookie-parser');

// // Swagger UI 路徑
var server = app.listen(3001, function() {
    // console.log('Express server listening on port ' + server.address().port);
});
app.use('/api-docs', (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // console.log(`Swagger UI accessed: ${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
  });
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// const { fail } = require('assert');
// let redisClient = redis.createClient({
//   url: 'redis://redis:6379',
//   host: 'redis', // Docker Compose service name
//   port: 6379
// });
// redisClient.on('error', (err) => {
//   console.error('Redis error:', err);
// });
// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });
// redisClient.connect().catch(console.error);
// async function testRedisClient(key, value) {
//   try {
//     const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
//     await redisClient.set(key, stringValue);
//     const reply = await redisClient.get(key);
//     console.log('Redis get reply:', reply);
//   } catch (err) {
//     console.error('Redis operation error:', err);
//   }
// }
// testRedisClient('async_testKey103984576', 'async_testValue103984576');


// async function useRedisClient(key, value) {
//   try {
//     const stringKey = typeof value === 'string' ? value : JSON.stringify(key);
//     const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
//     await redisClient.set(stringKey, stringValue);
//     const reply = await redisClient.get(stringKey);
//     console.log('Redis get reply:', reply);
//   } catch (err) {
//     console.error('Redis operation error:', err);
//   }
// }
// module.exports.useRedisClient = useRedisClient;
// redisClient.set('none_async_testKey', 'none_async_testValue', redis.print);
// const reply = await redisClient.get('none_async_testKey');
// console.log('Redis get reply:', reply);
// redisClient.get('none_async_testKey', (err, reply) => {
//   if (err) {
//     console.error('Redis get error:', err);
//   } else {
//     console.log('Redis get reply:', reply);
//   }
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({
  // store: new RedisStore({ client: redisClient }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  // sameSite: 'None', // 如果你的站点使用 HTTPS，确保同时设置 secure: true
  cookie: {
    // secure: process.env.NODE_ENV === "production", // 仅在生产环境中启用
    // secure: false, // 仅在 HTTPS 下使用
    httpOnly:false,
    sameSite: 'lax',
    maxAge: 60000*200 // 允许在跨站請求中发送 cookie
  }
  // key: 'SESSION_ID',
  //name:'likeid',//返回客户端key的名称，默认为connect_sid
	// secret: 'secret',//secret(必要選項)：用來簽章 sessionID 的cookie, 可以是一secret字串或是多個secret組成的一個陣列。如果是陣列, 只有第一個元素會被 簽到 sessionID cookie裡。而在驗證請求中的簽名時，才會考慮所有元素。
	// resave: true,//強制將session存回 session store, 即使它沒有被修改。預設是 true
	// saveUninitialized: false,//強制將未初始化的session存回 session store，未初始化的意思是它是新的而且未被修改。
  // sameSite: 'None'
//   store:new mongoStore({//将session数据存储到mongo数据库中
//     url:'mongodb://localhost:27017/college', //数据库地址
//     touchAfter:24*3600  //多长时间往数据库中更新存储一次，除了在会话数据上更改了某些数据除外
// })
}));


// CORS 配置
const corsOptions = {
  origin: ['http://localhost','http://127.0.0.1','https://smartypantspal.com', 'http://35.221.230.245'], // 你的前端应用的来源
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // 允许发送cookies
};

// https://ithelp.ithome.com.tw/articles/10187464
// app.use(cors());
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //設定抓取public裡的靜態檔案
app.get('/', function(request, response) {
  // Execute Redis query
  // redisClient.get('key', function(err, reply) {
  //   if (err) {
  //     console.error(err);
  //     response.status(500).send('Error occurred');
  //   } else if (reply) {
  //     // Use the reply from Redis in some way
  //     console.log(reply);
  //   } else {
  //     // Key does not exist in Redis
  //     console.log('Key not found in Redis');
  //   }
  // });

  // Render login template
  // response.sendFile(path.join(__dirname + '/public/login.html'));
});

// 套件引入
app.use('/aos', express.static(path.join(__dirname, 'node_modules/aos/dist')))
app.use('/simplelightbox', express.static(path.join(__dirname, 'node_modules/simplelightbox/dist')))
app.use('/table', express.static(path.join(__dirname, 'node_modules/datatables.net-responsive')))
app.use('/xlsx', express.static(path.join(__dirname, 'node_modules/xlsx/dist')))
app.use('/bootstrap4.6.1', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/datatablebs4', express.static(path.join(__dirname, 'node_modules/datatables.net-responsive-bs4/css')))
//路徑
app.use('/', indexRouter); //將上面引入檔案路由設定
app.use('/users', usersRouter);
app.use('/api', api);
// app.use('/img', imgupload);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Check if headers have already been sent
  if (!res.headersSent) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With,X-App-Id, X-Token');
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Max-Age', '3600');
  }

  // render the error page
  res.status(err.status || 500);
  if (!res.headersSent) {
    res.render('error');
  }
});


// module.exports = {app,useRedisClient};
module.exports = app;