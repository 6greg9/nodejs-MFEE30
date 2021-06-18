const axios = require("axios");
const moment = require("moment");
let twseMod = {
  fetchData: async (stockCode) => {
    return await axios.get(
      "https://www.twse.com.tw/exchangeReport/STOCK_DAY?", //這隻API抓資料

      {
        params: {
          response: "json",
          date: moment().format("YYYYMMDD"),
          stockNo: stockCode,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  toSaveFormat: (dailyPrice,stockCode) => {
    if (dailyPrice.data.stat !== "OK") {
      //reject("查詢失敗");
      return "fail";
    } else {
      return price = dailyPrice.data.data.map((item) => {
        //資料字串處理
        item = item.map((value) => {
          return value.replace(/,/g, "");
        });
        item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;
        item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD");
        item.unshift(stockCode);
        return item;
      });
    }
  },
};

module.exports = twseMod;
