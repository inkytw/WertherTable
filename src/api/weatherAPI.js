import apiIns from '.';

const TOKEN = 'CWB-7638F784-C1C0-4229-9430-6820A764435D';

// 現在天氣觀測報告 v1/rest/datastore/O-A0003-001
export const weatherNow = () => apiIns.get(`/O-A0003-001?Authorization=${TOKEN}&elementName=WDSD,TEMP,Weather&parameterName=CITY,TOWN`);

// 今明 36 小時天氣預報 v1/rest/datastore/F-C0032-001
export const weatherForecast = (cityName) => apiIns.get(`/F-C0032-001?Authorization=${TOKEN}&locationName=${cityName}&sort=time`);