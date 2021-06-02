const axios = require("axios");
const moment = require("moment");
// let year = new Date().getFullYear();
// let month = new Date().getMonth() + 1;
// if (month < 10) {
//   month = "0" + month;
// }
// let date = new Date().getDate();
// if (date < 10) {
//   date = "0" + date;
// }
// let dateTime = year + month + date;
let dateTime = moment().format("YYYYMMDD");
// async function getUser() {
//   try {
//     const response = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210523&stockNo=2610');
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };
// getUser();
// https://www.twse.com.tw/exchangeReport/STOCK_DAY
// ?response=json
// &date=20210523
// &stockNo=2610

// npm i axios
// 引入 axios
//const axios = require("axios");

// TODO: 從 stock.txt 讀股票代碼進來
// filesystem
// npm i fs ??? -> 不用
const fs = require("fs");

function fsPromise() {
  return new Promise((resolve, reject) => {
    fs.readFile("crawler/stock.txt", "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
// fsPromise()
//   .then((data) => {
//     return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
//       params: {
//         response: "json",
//         date: "20210523",
//         stockNo: data,
//       },
//     });
//   })
//   .then(function (response) {
//     if (response.data.stat === "OK") {
//       console.log(response.data.date);
//       console.log(response.data.title);
//     }
//   });
async function fsAsync(dateTime) {
  try {
    let fsRes = await fsPromise();
    let axiosRes = await axios.get(
      "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
      {
        params: {
          response: "json",
          date: dateTime,
          stockNo: fsRes,
        },
      }
    );
    if (axiosRes.data.stat === "OK") {
      console.log(axiosRes.data.date);
      console.log(axiosRes.data.title);
    }else{
      throw("http error")
    }
  } catch (err) {
    console.log(err);
  }
}
fsAsync(dateTime);

// fs.readFile("stock.txt", "utf8", (err, data) => {
//   if (err) {
//     return console.error("讀檔錯誤", err);
//   }
//   console.log(`讀到的 stock code: ${data}`);

//   axios
//     .get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
//       params: {
//         response: "json",
//         date: "20210523",
//         stockNo: data,
//       },
//     })
//     .then(function (response) {
//       if (response.data.stat === "OK") {
//         console.log(response.data.date);
//         console.log(response.data.title);
//       }
//     });
// });
