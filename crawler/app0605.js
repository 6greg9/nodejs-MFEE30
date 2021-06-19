const axios = require("axios");
const fs = require("fs/promises");
// const mysql = require("mysql");
// const Promise = require("bluebird");
const moment = require("moment");

const connection = require("./util/db");
const twseMod = require("./twse");

// require("dotenv").config();
// console.log(process.env.DB_HOST);
// let connection = mysql.createConnection({
//   host: process.env.DB_HOST,

//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
//建立連線
//connection = Promise.promisifyAll(connection);

(async function () {
  try {
    await connection.connectAsync();

    //讀取STOCK.TXT
    let stockJson = await fs.readFile("crawler/stock.txt", "utf-8");
    let stockCodeArray = JSON.parse(stockJson).stockCode;
    console.log(`股票: ${stockCodeArray}`);
    // stockCodeArray.forEach(async(element) => {
    //   await getStockPromise(element)
    //   .then((res)=>{
    //     console.log(res);})
    //   .catch((err)=>{
    //     console.log(err);
    //   });
    // });
    //

    // MAGIC
    await new Promise((resolve, reject) => {
      let cnt = 0;
      stockCodeArray.forEach(async (element) => {
        await getStockPromise(element);
        cnt++;
        //console.log(cnt);
        if (cnt === stockCodeArray.length) {
          resolve();
        }
      });
    });

    // await new Promise.all( stockCodeArray.map((element) => {
    //   return getStockPromise(element);
    // }) );

    //  應該這樣才對...
    // for(let i=0; i<stockCodeArray.length; i++){
    //   await getStockPromise(stockCodeArray[i]);
    // }
    // await getStockPromise(stockCodeArray[0]);

    async function getStockPromise(stockCode) {
      // return new Promise(async(resolve,reject)=>{
      try {
        let stock = await connection.queryAsync(
          `SELECT stock_id FROM stock WHERE stock_id = ${stockCode} limit 1`
        );
        //console.log("check");
        if (stock == 0) {
          let response = await axios.get(
            `https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}` //用這支API查存在嗎
          );
          let stockData = response.data.suggestions
            .map((ele) => ele.split("\t"))
            .find((ele) => ele[0] == stockCode);
          console.log(stockData);

          if (stockData.length > 1) {
            await connection.queryAsync(
              `INSERT INTO stock (stock_id, stock_name) VALUES ('${stockData[0]}', '${stockData[1]}')`
            );
          }
        } else {
          //console.log("check");
          //reject( "重複");
          throw `${stockCode}重複`;
        }

        let dailyPrice = await twseMod.fetchData(stockCode);
        // let dailyPrice = await axios.get(
        //   "https://www.twse.com.tw/exchangeReport/STOCK_DAY?", //這隻API抓資料

        //   {
        //     params: {
        //       response: "json",
        //       date: moment().format("YYYYMMDD"),
        //       stockNo: stockCode,
        //     },
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        // if (dailyPrice.data.stat !== "OK") {
        //   //reject("查詢失敗");
        //   throw "查詢失敗";
        // } else {
        //   let price = dailyPrice.data.data.map((item) => {
        //     //資料字串處理
        //     item = item.map((value) => {
        //       return value.replace(/,/g, "");
        //     });
        //     item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;
        //     item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD");
        //     item.unshift(stockCode);
        //     return item;
        //   });
        let dailyPriceSave = twseMod.toSaveFormat(dailyPrice,stockCode);
        if (dailyPriceSave === "fail") {
          throw "查詢失敗";
        } else {
          let insertData = await connection.queryAsync(
            "INSERT IGNORE INTO  stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
            [dailyPriceSave] //batch upload 批次上傳
          ); // ? 不用括號。把api欄位console出來丟進資料庫對應欄位
          //resolve(`成功寫入資料庫，代碼為${stockCode}`);

          console.log(`成功寫入資料庫，代碼為${stockCode}`);
        }
      } catch (err) {
        console.error(err);
      }

      //})
    }
  } catch (err) {
    //包在打開Mysql
    console.error(err);
  } finally {
    connection.end();
  }
})();
