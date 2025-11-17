const express = require("express");
const db = require("./db.js");
const cors = require("cors");

const app = express(); // 웹서버기능.
const port = 3000;

app.use(cors()); // cors 원칙.
app.use(express.json()); // body-parser json 처리.
app.use(express.urlencoded()); // key=val&key=val&.....

// url : 실행함수 => 라우팅.
app.get("/", (req, res) => {
  res.send("/ 호출됨.");
});

// board 목록 조회.
app.get("/boards", async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    let result = await connection.execute(`select * from board order by 1`);
    console.log(result.rows);
    //res.send("조회완료"); // txt, html....
    res.json(result.rows); // json 문자열로 응답.
  } catch (err) {
    console.log(err);
    res.send("예외발생");
  } finally {
    // 정상실행/ 예외발생
    if (connection) {
      await connection.close();
    }
  }
});

// board 단건 조회.
app.get("/board/:id", async (req, res) => {
  const searchId = req.params.id;
  let connection;
  try {
    connection = await db.getConnection();
    let result = await connection.execute(
      `select * from board where board_id = ${searchId}`
    );
    console.log(result.rows);
    //res.send("조회완료"); // txt, html....
    res.json(result.rows); // json 문자열로 응답.
  } catch (err) {
    console.log(err);
    res.send("예외발생");
  } finally {
    // 정상실행/ 예외발생
    if (connection) {
      await connection.close();
    }
  }
});

// 글등록.
app.post("/board", async (req, res) => {
  const { title, content, author } = req.body; // 객체 구조분해.
  console.log(title, content, author);
  let connection;
  try {
    connection = await db.getConnection();
    let result = await connection.execute(
      `insert into board(board_id, title, content, author)
       values ((select max(board_id) + 1 from board), :title, :content, :author)`,
      [title, content, author],
      { autoCommit: true } // 자동커밋.
    );
    // connection.commit(); // 커밋.
    console.log(result);
    //res.send("조회완료"); // txt, html....
    res.json(result); // json 문자열로 응답.
  } catch (err) {
    console.log(err);
    // res.send("예외발생");
    res.json(err);
  } finally {
    // 정상실행/ 예외발생
    if (connection) {
      await connection.close();
    }
  }
});

// 글수정
app.put("/board", async (req, res) => {
  const { title, content, id } = req.body; // 객체 구조분해.
  console.log(title, content, id);
  let connection;
  try {
    connection = await db.getConnection();
    let result = await connection.execute(
      `update board
       set    title = :title
             ,content = :content
       where board_id = :id`,
      [title, content, id],
      { autoCommit: true } // 자동커밋.
    );
    // connection.commit(); // 커밋.
    console.log(result);
    //res.send("조회완료"); // txt, html....
    res.json(result); // json 문자열로 응답.
  } catch (err) {
    console.log(err);
    // res.send("예외발생");
    res.json(err);
  } finally {
    // 정상실행/ 예외발생
    if (connection) {
      await connection.close();
    }
  }
});

app.listen(port, () => {
  console.log(`Express 서버가 실행중...http://localhost:${port}`);
});
