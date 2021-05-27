const axios = require('axios');


async function getUser() {
  try {
    const response = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210523&stockNo=2610');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
getUser();