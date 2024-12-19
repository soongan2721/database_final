var express = require('express');//引入函式庫並建立 express instance
// const { useRedisClient:redis } = require('../../../app')
var router = express.Router();
var mariadb = require('mariadb/callback');//引入mariadb
var con = require('../../config/DBconfig');//引入剛剛創建的資料庫設定
var articleModule = require('../modules/article.module');
// var { useRedisClient: redis } = require('../../../redis')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
const pool = mariadb.createPool({
  port: con.port, // 連接阜號
  host: con.host, // 主機名稱 
  user: con.user, // 用戶名稱
  password: con.password, // 資料庫密碼
  database: con.database, // 資料庫名稱,
  connectionLimit: con.connectionLimit
});
/* mariadb連線測試 */
router.get('/api/sql', 
  /*
    #swagger.tags = ['database']
    #swagger.description = '資料庫連線'
  */
  (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("not connected due to error: " + err);
    } else {
      console.log("connected ! connection id is " + conn.threadId);
      res.send('連線成功!');
      conn.end(); //release to pool
    }
  });
});
var authInfo = {}
router.post('/api/loginn', 
  /*
    #swagger.tags = ['login'];
    #swagger.description = '使用者登入系統'
    #swagger.parameters['username'] = {
      in: 'body',
      description: '使用者帳號',
      required: true,
      type: 'string' 
     }
    #swagger.parameters['password'] = {
      in: 'body',
      description: '使用者密碼',
      required: true,
      type: 'string'
     }
    #swagger.responses[200] = {
      description: '登入成功',
      schema: {$ref: '#/definitions/loginResponse'}
     }
    
  */
  function (request, response) {
  console.log("--loginn--")
  console.log({ sessionID: request.sessionID })
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("--loginn--")
      console.log(`not connected due to error:  + ${err}`);
      console.log("--End of loginn--")
    } else {
      let username = request.body.username; // 使用用户名而非邮箱
      let password = request.body.password;
      console.log("--log user input")
      console.log({
        "username": username,
        "password": password,
        "request.body": request.body,
        "request.query": request.query
      })
      request.session.loggedin = false;
      // Ensure the input fields exists and are not empty
      if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        pool.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
          if (error) throw error;
          // If the account exists
          if (results.length > 0) {
            // Authenticate the user
            request.session.loggedin = true;
            request.session.username = results[0].username;
            // redis(results[0].username, request.sessionID)
            console.log(`results[0].username = ${results[0].username}`)
            console.log("--Authenticate the user")
            console.log({
              "results.length > 0:": "",
              "results": results,
              "results[0]['isboss']}": results[0]['isboss']
            }
            );
            let permissions = results[0]['isboss'] === '管理員';
            let authInfo = { 'name': request.session.username, 'isboss': permissions };

            // Store user information in session
            request.session.authInfo = authInfo;
            console.log({
              "request.session.authInfo:": request.session.authInfo,
              "request.session": request.session,
              "request.sessionID": request.sessionID
            });

            // Update session ID in the database
            pool.query('UPDATE login SET session_id=? WHERE username = ?', [request.sessionID, request.session.username], function (error, updateResults, fields) {
              if (error) {
                console.error('SQL error: ', error);
                console.log("--End of loginn--")
              } else {
                console.log("--Session ID updated");
                console.log("--End of loginn--")
              }
              conn.end();
            });

            // Respond with success message
            let mes = ["成功", request.session.username, request.session, request.sessionID];
            response.send(mes);

            // 紀錄登入行為 -----------------------------------------------

            const inputValues = {
              action: '登入',
              username: request.session.username
            }
            articleModule.addRecord(inputValues);

            // 紀錄登入行為 END -----------------------------------------------

          } else {
            response.send('帳號或密碼輸入錯誤!');
            console.log("帳號或密碼輸入錯誤");
            console.log("--End of loginn--")
          }
          conn.end();
        });
      } else {
        response.send('請輸入您的帳號密碼!');
        console.log("--End of loginn--")
        conn.end();
      }
      
    }
  });
});
// router.post('/check_email', function (request, response) {
//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log("not connected due to error: " + err);
//     } else {
//       let email = request.body.email;
//       // Ensure the input fields exists and are not empty
//       if (email) {
//         // Execute SQL query that'll select the account from the database based on the specified username and password
//         pool.query('SELECT * FROM login WHERE email = ? ', [email], function (error, results, fields) {
//           // If there is an issue with the query, output the error
//           if (error) throw error;
//           // If the account exists
//           if (results.length > 0) {
//             // Authenticate the user
//             // Redirect to home page
//             response.send('信箱已註冊');

//           } else {
//             response.send('沒重複!');
//           }
//           conn.end();
//         });
//       } else {
//         response.send('請輸入信箱!');
//         conn.end();
//       }
//     }
//   });
// });

router.post('/api/check_username', function (request, response) {
  /*
    #swagger.tags = ['login']
    #swagger.description = '去資料庫檢查這個帳號是否有人使用'
    #swagger.parameters['usrename'] = {
      in: 'body',
      description: '使用者帳號',
      require: true,
      type: 'string'
     }
  */
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("not connected due to error: " + err);
    } else {
      let username = request.body.username;
      // Ensure the input fields exists and are not empty
      if (username) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        pool.query('SELECT * FROM login WHERE username = ? ', [username], function (error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) throw error;
          // If the account exists
          if (results.length > 0) {
            // Authenticate the user
            // Redirect to home page
            response.send('使用者已存在');

          } else {
            response.send('沒重複!');
          }
          conn.end();
        });
      } else {
        response.send('請輸入使用者名稱!');
        conn.end();
      }
    }
  });
});
router.post('/api/signup', 
  /*
    #swagger.tage = ['login']
    #swagger.description = '使用者註冊帳戶'
    #swagger.parameters['usrename'] = {
      in: 'body',
      description: '使用者帳號',
      require: true,
      type: 'string'
     }
    #swagger.parameters['password'] = {
      in: 'body',
      description: '使用者密碼',
      require: true,
      type: 'string'
     }
  */
  function (request, response) {
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("not connected due to error: " + err);
    } 
    else {
      let password = request.body.password;
      let username = request.body.username;
      let id = request.sessionID;
      console.log(password);
      console.log(username);
      request.session.loggedin = false;
      // Ensure the input fields exists and are not empty

      let sql = 'SELECT username FROM login WHERE username = ?'
      if(username && password){
        conn.query(sql, [username], (error, result) => {
          if(error){
            response.send(error);
            console.error(error);
          }
          else{
            console.log(result);
            if(result.length > 0){
              response.send("用戶已存在");
            }
            else {
              sql = 'INSERT INTO login(password, username, isboss, session_id) VALUES (?, ?, ?, ?)';
              conn.query(sql, [password, username, '使用者', 'NOT Login'], (error, result) => {
                if(error){
                  response.send(error);
                }
                else if(result.affectedRows == 1){
                  response.send('用戶新增成功');
                }
                conn.release();
              })
            }
          }
        })
      }
      else{
        response.send('請輸入完整資料!');
        conn.release();
      }
    }
  });
});

//權限更新
// router.post('/updata_permission', function (request, response) {

//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log("not connected due to error: " + err);
//     } else {
//       let user = request.body.user
//       let permission = request.body.permission;
//       console.log(request.body)
//       // Execute SQL query that'll select the account from the database based on the specified username and password
//       let query = 'update login set isboss ="' + permission + '" where username = "' + user + '"'
//       console.log(query)
//       pool.query(query, function (error, results, fields) {
//         // If there is an issue with the query, output the error
//         if (error) {
//           console.error('SQL error: ', error); // 寫入資料庫有問題時回傳錯誤
//         } else {
//           response.send(results);
//         }
//         conn.end();
//       });

//     }
//   });
// });

//權限介面
// router.get('/permission_interface', function (request, response) {
//   // If the user is loggedin
//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log("not connected due to error: " + err);
//     } else {
//       // Ensure the input fields exists and are not empty
//       // Execute SQL query that'll select the account from the database based on the specified username and password
//       pool.query('SELECT * FROM login ', function (error, results, fields) {
//         // If there is an issue with the query, output the error
//         if (error) throw error;
//         // If the account exists

//         // console.log(results[0].session_id,,"%%%")

//         response.send(results)
//         response.end();
//         conn.end();
//       });

//     }
//   });
//   // Not logged in
//   // response.send(request.session);
// });
// router.get('/test', function (request, response) {
//   // If the user is loggedin
//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log("not connected due to error: " + err);
//       response.status(500).send('Server error');
//       return; // 提前返回，避免进一步执行
//     } else {
//       console.log(request.session.username, 'adssad',request.session)
//       let username = request.session.username;
//       response.send('test',request.session)
//       // Ensure the input fields exists and are not empty
//       // if (username) {
//       //   // Execute SQL query that'll select the account from the database based on the specified username and password
//       //   pool.query('SELECT * FROM login WHERE username = ? ', [username], function (error, results, fields) {
//       //     // If there is an issue with the query, output the error
//       //     if (error) throw error;
//       //     // If the account exists

//       //     // console.log(results[0].session_id,,"%%%")
//       //     let sessionid = [results[0].session_id, request.sessionID, results[0].username, results[0].isboss]
//       //     response.send(sessionid)
//       //     conn.end();
//       //   });
//       // } else {
//       //   response.send('error')
//       //   response.end();
//       // }
//     }
//   });
//   // Not logged in
//   // response.send(request.session);
// });

router.get('/api/login_check', function (request, response) {
  // If the user is loggedin
  console.log("--login_check--")
  console.log({sessionID:request.sessionID})
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("not connected due to error: " + err);
      response.status(500).send('Server error');
      console.log("--End of login_check--")
      return; // 提前返回，避免进一步执行
    } else {
      console.log("執行登入檢查:")

      console.log({
        // request:request,
        // "request.session":request.session
        "request.session.username":request.session.username,
        "request.session":request.session, 
        "request.sessionID":request.sessionID
      })
      let username = request.session.username;
      // Ensure the input fields exists and are not empty
      if (username) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        pool.query('SELECT * FROM login WHERE username = ? ', [username], function (error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) throw error;
          // If the account exists

          // })
          let sessionid = [results[0].session_id, request.sessionID, results[0].username, results[0].isboss,request.session.loggedin]
          console.log({
            sessionid:sessionid
          })
          response.send(sessionid)
          console.log("--End of login_check--")
          conn.end();
        });
      } else {
        response.send('error')
        response.end();
        console.log("--End of login_check--")
      }
    }
  });
  // Not logged in
  // response.send(request.session);
});

// router.post('/logout', function (request, response) {
//   // If the user is loggedin
//   let infomation = request.session
//   console.log(infomation,'@@@',request.session)
//   // delete session id
//   pool.getConnection((err, conn) => {
//     if (err) {
//       console.log("not connected due to error: " + err);
//     } else {
//       pool.query('UPDATE login SET session_id=? WHERE username = ?', [null, infomation.username], function (error, results, fields) {
//         // If there is an issue with the query, output the error
//         if (error) {
//           console.error('SQL error: ', error);// 寫入資料庫有問題時回傳錯誤
//           // reject(error);
//         } else {
//           console.log("session is delete")
//           // Not logged in
//           request.session.destroy();

//           response.send("登出");
//         }
//         conn.end();
//       });
//     }
//   });
// });
router.post('/api/logout', async (request, response) => {
  let information = request.session;

  // 使用连接池获取连接
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log("not connected due to error: " + err);
      return response.status(500).send("数据库连接失败");
    }

    try {
      // 更新数据库中的 session_id 为 null
      await new Promise((resolve, reject) => {
        conn.query('UPDATE login SET session_id=? WHERE username = ?', [null, information.username], (error, results) => {
          conn.end(); // 释放连接
          if (error) {
            console.error('SQL error: ', error);
            reject(error);
          } else {

            console.log("Session ID in database is deleted");

            // 紀錄登出行為 -----------------------------------------------
            
            const inputValues = {
              action: '登出',
              username: request.session.username
            }
            articleModule.addRecord(inputValues);

            // 紀錄登出行為 END -----------------------------------------------

            resolve(results);

          }
        });
      });

      // 销毁 session
      await new Promise((resolve, reject) => {
        request.session.destroy((error) => {
          if (error) {
            console.error('Session destroy error:', error);
            reject(error);
          } else {
            console.log("Session is deleted");
            resolve();
          }
        });
      });

      // 可选：清除浏览器的 session cookie
      response.clearCookie('connect.sid');

      response.send("登出成功");
    } catch (error) {
      response.status(500).send("登出失败");
    }
  });
});

module.exports = router;
