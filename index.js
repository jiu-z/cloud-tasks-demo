// Imports the Google Cloud Tasks library.
const { CloudTasksClient } = require("@google-cloud/tasks");

// Instantiates a client.
const client = new CloudTasksClient();

exports.taskGenerator = async (req, res) => {
  const taskCount = 5;
  const project = "nova-fe";
  const queue = "gdgdemo";
  const location = "asia-northeast1";
  const url = "https://us-central1-nova-fe.cloudfunctions.net/taskHandler";
  const inSeconds = 30;

  for (let i = 0; i < taskCount; i++) {
    const payload = {
      a: Math.floor(Math.random() * 100),
      b: Math.floor(Math.random() * 100),
    };
    const parent = client.queuePath(project, location, queue);
    const task = {
      httpRequest: {
        headers: {
          "Content-Type": "application/json", // Set content type to ensure compatibility your application's request parsing
        },
        httpMethod: "POST",
        url,
      },
    };
    if (payload) {
      task.httpRequest.body = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64");
    }
    // if (inSeconds) {
    //   // The time when the task is scheduled to be attempted.
    //   task.scheduleTime = {
    //     seconds: parseInt(inSeconds) + Date.now() / 1000,
    //   };
    // }
    console.log("Sending task:");
    console.log(task);
    const request = { parent: parent, task: task };
    const [response] = await client.createTask(request);
    console.log(`Created task ${response.name}`);
  }

  res.json({ status: "OK" });
};

exports.taskHandler = async (req, res) => {
  console.log("body", JSON.stringify(req.body));
  const a = req.body.a;
  const b = req.body.b;

  const result = a + b;

  // Artificial delay to reflect task uncertainty
  await new Promise((resolve) => {
    setTimeout(resolve, 500 + Math.floor(Math.random() * 1000));
  });

  console.log("a", a, "b", b, "result", result);

  res.json({ result });
};

exports.taskGeneratorTwo = async (req, res) => {
  // const taskCount = +process.env.TASK_COUNT || 10;
  const project = "nova-fe";
  const queue = "gdgdemo";
  const location = "asia-northeast1";
  const url = "https://34.36.230.79/";
  const payload = "Hello, World!";
  const inSeconds = 30;

  const parent = client.queuePath(project, location, queue);

  const task = {
    httpRequest: {
      headers: {
        "Content-Type": "text/plain", // Set content type to ensure compatibility your application's request parsing
      },
      httpMethod: "POST",
      url,
    },
  };

  if (payload) {
    task.httpRequest.body = Buffer.from(payload).toString("base64");
  }

  if (inSeconds) {
    // The time when the task is scheduled to be attempted.
    task.scheduleTime = {
      seconds: parseInt(inSeconds) + Date.now() / 1000,
    };
  }
  // Send create task request.
  console.log("Sending task:");
  console.log(task);
  const request = { parent: parent, task: task };
  const [response] = await client.createTask(request);
  console.log(`Created task ${response.name}`);

  res.json({ status: "OK" });
};
