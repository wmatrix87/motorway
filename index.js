require('dotenv').config()
const { retry, retries } = require('./retry');
const Table = require('./table/visitors');
const request = require('./request');


const loginPath = `${process.env.HOST}/api/login`;
const dataPath = (pageNo = 1, token) => `${process.env.HOST}/api/visits?page=${pageNo}&token=${token}`;


const getData = (pageNo, token) => request(dataPath(pageNo, token))


const runScript = async () => {
  const promises = []
  const storage = new Table();

  const token = await retry(() => request(loginPath)).then(({ token }) => token);
  const visitorsData = await getData(1, token);
  storage.setAll(visitorsData.data);

  const pageCount = Math.ceil(visitorsData.total / visitorsData.data.length);

  
  if ( pageCount > 1 ) {
    for (let page = 2; page <= pageCount; page++) {
      promises.push(() => getData(page, token))
    }
    await retries(promises)
      .then((visitors => visitors.forEach(({data}) => storage.setAll(data))));
  }
  
  console.log('token', token);
  console.log('pageCount', pageCount);
  console.log('storage', storage.getData());
  
  return storage.getData();
}


(async () => {
  await runScript();
})();
