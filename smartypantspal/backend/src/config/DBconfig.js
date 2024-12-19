var config = {
  //dev version
  host: '127.0.0.1',
  user: "root",
  password: "",

  // //docker version
  // host: 'host.docker.internal',
  // user: "root",
  // password: "",

  // //product version
  // host: 'host.docker.internal',
  // user: "admin",
  // password: "209balsdiA",

  port: "3306", // 連接阜號
  database: "gpt_database", // 資料庫名稱
  connectionLimit: 5 //連線池限制
};

module.exports = config; //模組匯出
