//// filepath: d:\ChatBot\dataUtils.js

const { timeToMinutes } = require('./timeUtils');

function filterDataByTime(data, start, end) {
  const sMin = timeToMinutes(start);
  const eMin = timeToMinutes(end);
  const filterList = list => list.filter(x => {
    const m = timeToMinutes(x.time);
    return m >= sMin && m <= eMin;
  });
  return {
    blood_pressure: {
      ...data.blood_pressure,
      readings: filterList(data.blood_pressure.readings)
    },
    sleep_cycle: data.sleep_cycle,
    daily_steps: {
      ...data.daily_steps,
      step_intervals: filterList(data.daily_steps.step_intervals)
    },
    heart_rate: {
      ...data.heart_rate,
      intervals: filterList(data.heart_rate.intervals)
    }
  };
}

function formatSimulatedData(data) {
  const bp = data.blood_pressure.readings
    .map(x => `${x.time} ${x.systolic}/${x.diastolic} mmHg`)
    .join('; ');
  const sleep = data.sleep_cycle;
  const steps = data.daily_steps;
  const hr = data.heart_rate.intervals
    .map(x => `${x.time} ${x.bpm} bpm`)
    .join('; ');
  return `
Blood Pressure (mmHg): ${bp}
Sleep: Start ${sleep.sleep_start}, Wake ${sleep.wake_time}, Duration ${sleep.duration}, Quality ${sleep.quality}, REM cycles ${sleep.rem_cycles}, Interruptions ${sleep.interruptions}
Steps: ${steps.actual_steps} of ${steps.target_steps} (Active: ${steps.active_minutes} min, Sedentary: ${steps.sedentary_minutes} min)
Heart Rate: ${hr}
`;
}

module.exports = { filterDataByTime, formatSimulatedData };