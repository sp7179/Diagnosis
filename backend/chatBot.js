const readline = require('readline');
const GoogleGenAI = require('@google/genai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { LLMChain } = require('langchain/chains');
const simulated_data = require('./simulatedData');
const fs = require('fs');

const {
  previousTime: initPreviousTime,
  setCurrentTime,
  getCurrentTime,
  timeToMinutes,
  persistTime
} = require('./timeUtils');
const {
  filterDataByTime,
  formatSimulatedData
} = require('./dataUtils');

// on startup load last‐run time or default to 06:00
let previousTime = initPreviousTime;

// ─── Define meal times & state ──────────────────────────────────────
const schedule = {
  breakfast: '08:00',
  lunch:     '12:30',
  dinner:    '19:00'
};
let askedBreakfast = false;
let askedLunch     = false;
let askedDinner    = false;


class InMemoryHistory {
  constructor() { this.messages = []; }
  addMessages(messages) { this.messages.push(...messages); }
  clear() { this.messages = []; }
}
const store = {};
function getBySessionId(sessionId) {
  if (!store[sessionId]) store[sessionId] = new InMemoryHistory();
  return store[sessionId];
}

// Build LangChain prompt + model
const systemMessage = `You are Samantha's personal health assistant.

User's clinical report:
{user_report}

Simulated smartwatch/health data:
{simulated_data}

Instructions:
- Answer questions on BOTH the clinical report and the latest simulated data in short.
- Only give ADVICE if the user explicitly asks for it, OR if a recent health parameter (like glucose, heart rate, or blood pressure) is significantly higher than normal.
- For meal notifications, you may ask about recent meals, but do not give advice unless the above conditions are met.
- If a value is missing or unknown, acknowledge it and offer general advice only if asked.
- Be supportive, clear, and use plain language.
`;

const prompt = ChatPromptTemplate.fromMessages([
  { role: 'system', content: systemMessage },
  new MessagesPlaceholder({ variableName: 'history' }),
  { role: 'user', content: '{input}' }
]);

const llm = new ChatGoogleGenerativeAI({
  apiKey: 'AIzaSyDgflhQJ2v0VxGCpDdbtP6wBiOX92oQgeg',
  model: 'gemini-2.0-flash-001',
  temperature: 0.7,
});

const chain = new LLMChain({ prompt, llm });

// ─── helper to check & fire meal‐prompts ─────────────────────────────
async function checkMealTriggers(sessionId) {
  const now = getCurrentTime();
  const mins = timeToMinutes(now);
  console.log('⏰ current time:', now);
  console.log('⏰ previous time:', previousTime);

  if (!askedBreakfast && mins >= timeToMinutes(schedule.breakfast)
      && mins < timeToMinutes(schedule.lunch)) {
    askedBreakfast = true;
    const windowData = filterDataByTime(simulated_data, previousTime, now);
    console.log('⏰ current time:', now);
    console.log('⏰ previous time:', previousTime);
    const resp = await chain.call({
      user_report:    simulated_data. userReportTexttText,
      simulated_data: formatSimulatedData(windowData),
      input:          'Ask the user What did you have for breakfast?',
      history:        getBySessionId(sessionId).messages
    });
    console.log(`\nAssistant (Breakfast Check): ${resp.text}\n`);
    return resp.text;
  }
  else if (!askedLunch && mins >= timeToMinutes(schedule.lunch)
           && mins < timeToMinutes(schedule.dinner)) {
    askedLunch = true;
    const windowData = filterDataByTime(simulated_data, previousTime, now);
    const resp = await chain.call({
      user_report:    simulated_data. userReportTexttText,
      simulated_data: formatSimulatedData(windowData),
      input:          'Ask the user What did you have for lunch?',
      history:        getBySessionId(sessionId).messages
    });
    console.log(`\nAssistant (Lunch Check): ${resp.text}\n`);
    return resp.text;
  }
  else if (!askedDinner && mins >= timeToMinutes(schedule.dinner)) {
    askedDinner = true;
    const windowData = filterDataByTime(simulated_data, previousTime, now);
    const resp = await chain.call({
      user_report:    simulated_data. userReportTexttText,
      simulated_data: formatSimulatedData(windowData),
      input:          'Ask the user What did you have for dinner?',
      history:        getBySessionId(sessionId).messages
    });
    console.log(`\nAssistant (Dinner Check): ${resp.text}\n`);
    return resp.text;
  }

  return null;
}

async function checkSpikeTriggers(sessionId) {
  const now = getCurrentTime();
  const windowData = filterDataByTime(simulated_data, previousTime, now);

  // ask the LLM to call out any spikes
  const resp = await chain.call({
    user_report:    simulated_data. userReportTexttText,
    simulated_data: formatSimulatedData(windowData),
    input:          'Please analyze any spikes in heart rate or blood pressure in the above recent data.',
    history:        getBySessionId(sessionId).messages
  });
  console.log(`\nAssistant (Spike Analysis): ${resp.text}\n`);
  return resp.text;
}


async function runChatbot() {
  const sessionId = 'samantha_session';
  let interactionCount = 0;

  // watch for time.js file changes
  fs.watchFile(require.resolve('./time.js'), { interval: 500 }, async (curr, prevFs) => {
    if (curr.mtimeMs !== prevFs.mtimeMs) {
      console.log('🕒 time.js changed, reloading time and checking meals...');
      setCurrentTime();
      const trigger = await checkMealTriggers(sessionId);
      if (trigger) {
        console.log(`🕒 trigger fired: ${trigger}`);
        getBySessionId(sessionId).addMessages([{ role: 'assistant', content: trigger }]);
      }
    }
  });

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("Welcome to Samantha's Health Assistant! (type 'exit' to quit)\n");

  for (;;) {
    // 1) meal‐check on each loop
    setCurrentTime();
    const mealPrompt = await checkMealTriggers(sessionId);
    if (mealPrompt) {
      getBySessionId(sessionId).addMessages([{ role: 'assistant', content: mealPrompt }]);
      console.log(`\nAssistant: ${mealPrompt}\n`);

      const spike = await checkSpikeTriggers(sessionId);
      if (spike) {
        getBySessionId(sessionId).addMessages([{ role: 'assistant', content: spike }]);
        console.log(`\nAssistant: ${spike}\n`);
      }
      continue;  // skip straight to next check
    }

    // 1a) build a window of simulated data from previousTime to now
    const now = getCurrentTime();
    const windowData = filterDataByTime(simulated_data, previousTime, now);

    // 2) Normal chat turn
    let userInput;
    if (interactionCount === 0) {
      userInput = 'Hi';
    } else {
      userInput = await new Promise(resolve => rl.question('You: ', resolve));
      if (userInput.toLowerCase() === 'exit') {
        console.log('Goodbye, Samantha! Stay healthy.');
        rl.close();
        break;
      }
    }

    // 3) call LLM with only the sliced simulated data
    const vars = {
      user_report:    simulated_data. userReportTexttText,
      simulated_data: formatSimulatedData(windowData),
      input:          userInput,
      history:        getBySessionId(sessionId).messages
    };
    const response = await chain.call(vars);

    // 4) update previousTime for next iteration
    previousTime = now;

    // persist last‐active time back into time.js
    persistTime(previousTime);

    // Update history & print
    getBySessionId(sessionId).addMessages([
      { role: 'user', content: userInput },
      { role: 'assistant', content: response.text }
    ]);
    console.log(`\nAssistant: ${response.text}\n`);
    interactionCount++;
  }
}

// runChatbot().catch(console.error);

// Export the setter so you can write e.g. setCurrentTime('08:05') in REPL/tests
module.exports = {
  setCurrentTime,
  checkMealTriggers,
  checkSpikeTriggers,
  chain,
  getBySessionId,
  previousTime,
  persistTime,
};
