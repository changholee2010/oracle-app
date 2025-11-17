// db.js
const oracledb = require("oracledb");

// db setting.
const dbConfig = {
  user: "scott",
  password: "tiger",
  connectString: "192.168.0.45:1521/xe",
};

async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("db 접속 성공");
    return connection; // connection반환.
  } catch (err) {
    console.log("db 접속 에러: ", err);
    throw err;
  }
}

module.exports = { getConnection }; // export 다른 js 사용.
