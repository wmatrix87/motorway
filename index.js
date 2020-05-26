require('dotenv').config()
const { retry, retries } = require('./retry');
const Table = require('./table');
const request = require('./request');


const loginPath = `${process.env.HOST}/api/login`;
const dataPath = (pageNo = 1, token) => `${process.env.HOST}/api/visits?page=${pageNo}&token=${token}`;
const MAX_LENGTH = 15;


const getData = async (pageNo, token) => request(dataPath(pageNo, token));

const loop = async (startFromPage, pageCount, token, visitorsBatch = []) => {
  const promises = [];
  for (let page = startFromPage; page <= pageCount; page++) {
    promises.push(() => getData(page, token))
  }

  (await retries(promises)).forEach(visitor => visitorsBatch.push(visitor));
  
  const maxTotalCount = visitorsBatch.reduce((prev, current) => (prev.total > current.total) ? prev.total : current.total);
  const maxPageCount = Math.ceil(maxTotalCount / MAX_LENGTH);

  if (maxPageCount > pageCount) {
    return loop(pageCount + 1, maxPageCount, token, visitorsBatch)
  }
  
  return visitorsBatch;
}

const runScript = async () => {
  const storage = new Table();

  const token = await retry(() => request(loginPath)).then(({ token }) => token);
  const visitorsData = await getData(1, token);
  const pageCount = Math.ceil(visitorsData.total / MAX_LENGTH);

  const visitorRecords = await loop(1 , pageCount, token, []);
  visitorRecords.forEach(({data}) => storage.setAll(data));
  
  console.log('storage', storage.getData());
  console.log('visitorRecordsBatchNo', visitorRecords.length);
  return storage.getData();
}


(async () => {
  await runScript();
})();
