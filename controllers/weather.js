const readlineSync = require('readline-sync');
const { OpenAI } =  require("openai");
const { OPEN_AI_KEY, DEEPSEEK_AI_KEY, HUGGING_FACE } = process.env
const { HfInference } = require("@huggingface/inference")

const client = new OpenAI({
    apiKey: OPEN_AI_KEY
})

// const client = new OpenAI({
//     baseURL: 'https://api.deepseek.com',
//     apiKey: DEEPSEEK_AI_KEY
// });

// const client = new HfInference(HUGGING_FACE);

// const SYSTEM_PROMPT = `You are a helpful AI Assistant`

//Tools
const getWeatherDetails = (city) => {
    city = city.toLowerCase()
    if(city === 'delhi') return "10°C"
    if(city === 'patiala') return "32°C"
    if(city === 'pune') return "15°C"
    if(city === 'jaipur') return "40°C"
    if(city === 'mohali') return "12°C"
}


const tools = {
    "getWeatherDetails": getWeatherDetails
}
const SYSTEM_PROMPT = `
##Role
You are an AI Assistant with START, PLAN, ACTION, Observation, and Output State.
Wait for the user query and first PLAN using available tools.
After Planing, Take the Action with appropriate tools and wait for the Observation based on the Action.
Once you get the Observation, Return the AI response based on START prompt and Observations
-If you getting undefine in observatin then respond to user I have don't weather detail of Delhi.


##Available Tools
- function getWeatherDetails = (city: string) string
- getWeatherDetails is a function that accept the city name as string and return the weather details

##Example
START
{"type":"user", "user":"What is the Wheather of Delhi?"}
{"type":"plan", "plan":"I will call the getWeatherDetails for the Delhi"}
{"type":"action", "function":"getWeatherDetails", "input":"Delhi"}
{"type":"observation", "observation":"10°C"},
{"type":"output", "output": "The weather of delhi is 48°C"}

{"type":"user", "user":"What is the sum of weather of delhi and pune"}
{"type":"plan", "plan":"I will call the getWeatherDetails for the Delhi"}
{"type":"action", "function":"getWeatherDetails", "input":"Delhi"}
{"type":"observation", "observation":"10°C"},
{"type":"plan", "plan":"I will call the getWeatherDetails for the pune"}
{"type":"action", "function":"getWeatherDetails", "input":"pune"}
{"type":"observation", "observation":"100"},

{"type":"output", "output": "The sum of the weather of delhi & pune is 48°C"}


-If user ask question which is not related to the weahter, then you have respond
{"type":"output", "output": "I am proivde only weahter detail"}

-If you get undefine or null in observation, then you have respond
{"type":"output", "output": "I have no weather detail of delhi"}
`

const userAsk = `Hey, what is the weater in pune?`
const chat_x = (async() => {
    try{

        const chatCompletion = await client.chatCompletion({
            model: "meta-llama/Llama-3.3-70B-Instruct",
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: userAsk
                }
            ],
            provider: "sambanova",
            max_tokens: 500,
        });

        
        
        console.log(chatCompletion.choices[0].message);
    }catch(error){
        console.log(`Error =>`, error)
    }
})


const chat_xx = (async() => {
    try{
        const SYSTEM_PROMPT_x = `
        -You are a helpful AI Assistant who gives the weather detail on user query as per the city name.
        -And if user ask any query which is not related to wheather then you respond as I am proivde only wehater details.
        `
        const messages = [
            {
                role:'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: userAsk
            },
            {
                role: "developer",
                content: '{"type":"plan", "plan":"I will call the getWeatherDetails for Delhi." }'
            },
            {
                role: "developer",
                content: '{"type":"action", "function":"getWeatherDetails", "input":"Delhi"}'
            },
            {
                role:"developer",
                content: '{"type":"observation", "observation":"25°C"}'
            }

        ]

        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages
        })

        const aiMessage = response?.choices[0]?.message?.content

        console.log(`response ==>`, aiMessage)
    }catch(error){
        console.log(`Errror ===>`, JSON.stringify(error, null, 2))
    }
})


const messages = [{
    role:'system',
    content: SYSTEM_PROMPT
}]

const chat = (async() => {
    try{
        while(true){
            const userQuery = readlineSync.question('How can I assit you? ');
            // const userQuery = 'what is weather in pune?'
            messages.push({
                role:'user',
                content: `{"type":"user", ${userQuery}}`
            })

            while(true){
                const response = await client.chat.completions.create({
                    model:'gpt-4o-mini',
                    messages: messages
                })

                const aiResponse = response?.choices[0]?.message?.content

                console.log(`message ==>`, aiResponse)

                messages.push({
                    role:'assistant',
                    content: aiResponse
                })

                const obj = JSON.parse(aiResponse)

                if(obj?.type === 'output'){
                    console.log(`Bot ==>`, obj?.output)
                    break;
                }else if(obj?.type === 'action') {
                    const definedFunction = tools[obj?.function]
                    const observation = definedFunction(obj?.input)
                    console.log(`Prx ==> `, observation)
                    messages.push({
                        role: 'developer',
                        content: JSON.stringify({type: "observation", observation: observation})
                    })
                }

            }
        }

    }catch(error){
        console.log(`Error ==>`, JSON.stringify(error, null, 2), error)
    }
})

chat()




const getWeather = (async (req, res, next) => {
    try{

        return res.send("ok")

    }catch(error){
        console.log(`Error inside getWeather`, error)
    }
})

module.exports = {
    getWeather
}