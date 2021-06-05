const axios = require("axios");
const fs = require("fs/promises");
const mysql = require("mysql");
const Promise = require("bluebird");


let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "greg4253058",
  database: "stock",
});
//建立連線
connection = Promise.promisifyAll(connection);

(async function () {
  try {
    await connection.connectAsync();

    //讀取STOCK.TXT
    let stockCode = await fs.readFile("crawler/stock.txt", "utf-8");
    console.log(`股票: ${stockCode}`);
    let stock = await connection.queryAsync(
      `SELECT stock_id FROM stock WHERE stock_id = ${stockCode} limit 1`
    );

    if (stock==0) {
      let response = await axios.get(
        `https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}`
      );
      let stockData = response.data.suggestions.map(ele=>(ele.split('\t'))).find(ele=>ele[0]==stockCode);
      console.log(stockData);
      
      if (stockData.length > 1) {
        
        connection.queryAsync(
          `INSERT INTO stock (stock_id, stock_name) VALUES ('${stockData[0]}', '${stockData[1]}')`
        );
      };

    } else {
      throw "重複";
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
})();
