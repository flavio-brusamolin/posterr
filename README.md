# Posterr - Flávio Brusamolin Brito

> Phase 1: Coding

## Prerequisites

- Docker Engine
- Docker Compose

## Installation

```
docker-compose up -d
```

Access on http://localhost:8080/api

## Playground

- Import the files from this directory into your Postman

```
./test/integration
```

- Use these user IDs for testing

```
"3341b936-9021-422b-999e-d8b40a5320a1"
"3341b936-9021-422b-999e-d8b40a5320a2"
"3341b936-9021-422b-999e-d8b40a5320a3"
"3341b936-9021-422b-999e-d8b40a5320a4"
```

## Test

```
npm run test:unit
npm run test:integration
```

---

# Planning

> Phase 2: Planning

## Questions

- Should it be possible to reply to a repost or quote post?
- Could this list of "posts and replies" be displayed apart from the user information at some point?

## Solution

- To deliver this feature, a new API endpoint must be created: **`POST /posts/{postId}/reply-to-post`**
  - In the headers, we would receive the id of the user who wants to perform the operation;
  - In the params, we would receive the id of the original post who that will be replied;
  - In the body, we would receive the content of user's reply.


- If the Product Manager says that the "posts and replies" list will not be displayed apart from the user information at any time, we could save a list of "replies" objects within the user document. These objects would contain the original post and the user's reply. For this alternative, we would load just the user's data to also see their replies.

```
User {
  "replies": [
    {
      "originalPost": {},
      "reply": ""
    }
  ]
}
```

- If the Product Manager says that the "posts and replies" list may be presented apart from the user information at some point, we could have a new collection called "replies". Each document in this collection would contain the id of the user who wants to perform the operation, the original post and the user's reply. For this alternative, it would be necessary to load the user's data separately from their replies. As an improvement, a BFF could easily aggregate these requests.

```
Reply {
  "userId": "",
  "originalPost": {},
  "reply": ""
}
```

- If the Product Manager says that it's not possible to reply to a repost or quote post, it will be necessary to execute a business rule to check which type of post you want to reply to, allowing only regular posts.

---

# Critique

> Phase 3: Critique

## Self-Critique

- First of all, I would finish the requested features, such as:
  - Post pagination;
  - Post search.


- And then:
  - I would create a Decorator to wrap all http controllers, executing some rules that are common to them, such as: input data validation and error handling/logging;
  - I would look for a way to reuse business rules that are repeated in some application services, such as: number of daily posts validation;
  - I would write all possible unit tests;
  - I would write feature tests;
  - I would implement automatic documentation generation (Swagger);
  - I would create a logging strategy in order to improve monitoring and debugging;
  - I would set up a continuous integration pipeline.

## Scaling

In general, a monolith has scalability problems because it's impossible to increase resources, focusing only on the system bottlenecks. In this case, we need to scale the whole application, causing high costs and waste of resources. Also, as the application grows, multiple teams working on the same code base becomes unsustainable.

So, with the project growth, it might be necessary to break the features into microservices, correctly delimiting domains and contexts. In this case, if our `post-ms` service (for example) became a bottleneck, we would just scale it and not the other services.

For this type of architecture, some technologies/tools are recommended/essential:

- A robust cloud infrastructure (AWS, GCP, Azure);
- Container management and orchestration (Kubernetes);
- Centralized routes with an API Gateway (Apigee, APIM);
- Asynchronous communication via messaging (RabbitMQ, Apache Kafka, Azure Service Bus, etc).

_Obs: This option needs to be properly evaluated, because this type of architecture also has disadvantages. If poorly implemented, it can cause more problems than solutions._
