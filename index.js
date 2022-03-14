const ServerMock = require("mock-http-server");

const port = process.env.PORT || 3030;
const server = new ServerMock({
  host: "localhost",
  port,
});

const onStart = () => {
  console.log(`Server listening on port ${port}`);
};

server.on({
  method: "GET",
  path: "/resource",
  reply: {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ hello: "world" }),
  },
});

server.on({
  method: "GET",
  path: "/data/2.5/weather",
  reply: {
    status: () => {
      return shouldFail() ? 429 : 200;
    },
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: () => {
      return JSON.stringify(randWeather());
    },
  },
});

function shouldFail() {
  return Math.random() > 0.5;
}

function randWeather() {
  return {
    weather: [
      {
        id: 804,
        main: getRandResponse([
          "Thunderstorm",
          "Drizzle",
          "Rain",
          "Snow",
          "Atmosphere",
          "Clear",
          "Mist",
          "Snow",
          "Clouds",
        ]),
        description: "overcast clouds",
        icon: "04n",
      },
    ],
    main: {
      temp: Math.random() * 100,
    },
  };
}

function getRandResponse(responses) {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

server.start(onStart);
