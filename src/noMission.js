export function noMissionHtml() {
  return ''
}

export function setupNoMission() {
  let log = [];

  const setCount = (count) => {
  };

   const setLog = (newLog) => {
    log = newLog;
  };


  return {
    getHtml: () => missionHtml,
    getCount: () => 0,
    setCount,
    getLog: () => [...log],
    setLog,
  };
}
