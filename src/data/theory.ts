export type TheoryCard = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

export type TheoryTopic = {
  id: string;
  name: string;
  description?: string;
  cards: TheoryCard[];
};

const MICROSERVICES: TheoryCard[] = [
  {
    id: "ms-001",
    question: "What is a monolithic service or monolithic architecture?",
    answer: `Simple answer:- In monolithic application where all features will be at one place like authentication, user management, billing,notification and they will be built and deployed together as one unit

A monolithic architecture is a single, large application where all the features—like authentication, user management, billing, notifications—are built and deployed together as one unit.

Everything runs in the same codebase, same process, and same database.
So if I change one small feature, I have to redeploy the entire application.
In a monolithic setup:
All modules are tightly coupled
Scaling is only possible by scaling the whole application
A small issue in one module can affect the entire system
Build and deployment times become slow as the application grows
It's simple to start with, but difficult to maintain when the project becomes large.
Note:- a monolithic architecture can contains the FE web mvc (jsp,thymleaf pages)`,
    tags: ["fundamentals"],
  },
  {
    id: "ms-002",
    question: "Difference between Monolithic and Microservices (simple 3+ year explanation) (asked interview)",
    answer: `So basically both are the architecture design patterns that are used while develop the application.

Monolithic Architecture
The entire application is built as one single unit (UI, business logic, database access).
All modules are tightly coupled and deployed together.
Easy to develop and deploy initially.
Problem: A small change requires redeploying the whole application, and scaling is limited.
Example: One Spring Boot app handling users, orders, payments, and notifications together.
Microservices Architecture
Application is split into small, independent services, each responsible for a single business function.
Services communicate via REST or messaging.
Each service can be developed, deployed, and scaled independently.
Advantage: Better scalability, fault isolation, and flexibility for large systems.
Example: Separate services for User Service, Order Service, Payment Service.`,
    tags: ["fundamentals", "interview"],
  },
  {
    id: "ms-003",
    question: "Why Microservices?",
    answer: `The reason is that in monolithic all code and modules are tightly coupled even for slight changes. The whole application needs to redeploy when the project is large and there are multiple people working on it. It will get hard to manage so in terms of scalability, flexibility and faster development microservices is the best choice.`,
    tags: ["fundamentals"],
  },
  {
    id: "ms-004",
    question: "What are the disadvantages of microservices?",
    answer: `Multiple services so management becomes more complex.
Communication between services is big responsibility to use rest calls then fails retries timeout and network calls
From DevOps perspective it will be complicated instead of deploying and managing one application/services needs to now deploy many services.
Debugging is harder as compared to monolithic there will be multiple services so tracing issues needs proper logging and monitoring.
So each service have separate db so db consistency between services is not that much simple need to manage this as well`,
    tags: ["fundamentals"],
  },
  {
    id: "ms-006",
    question: "What is the difference between SOA and microservices? (need to refactor)",
    answer: `"SOA (service oriented architecture) is a broader enterprise-level architecture with heavy tools like ESB.
 Microservices are smaller, lightweight, and use simple communication like REST or messaging.
 SOA is big and complex; microservices are small, independent, and easy to deploy."`,
    tags: ["fundamentals"],
  },
  {
    id: "ms-007",
    question: "How do microservices communicate?",
    answer: `Microservices can communicate using two ways:
Synchronous Communication (http communication over network using rest)
\tRest template, feign client, web client
Asynchronous Communication (uses message broker)
          RabbitMQ, kafka other message broker

"Microservices communicate with each other mainly over the network. Since each service runs independently, one service talks to another using APIs or messaging. The most common way is using REST APIs over HTTP, where one microservice calls another microservice's endpoint."
"But communication can also happen through asynchronous messaging, where services don't call each other directly but publish events to a message broker like Kafka or RabbitMQ, and other services consume those events."`,
    tags: ["communication"],
  },
  {
    id: "ms-008",
    question: "How did you handle internal communication between microservices in your project?",
    answer: `(Personal answer — fill in based on your project.)`,
    tags: ["communication", "interview"],
  },
  {
    id: "ms-009",
    question: "When to use which one feign client, rest template, webclient and message broker for microservices communications?",
    answer: `👉 If I need immediate response → I use Feign/WebClient (Synchronous)
👉 If I need high performance reactive system → I use WebClient
👉 If services should be loosely coupled and async → I use Message Broker (Kafka/RabbitMQ)
👉 RestTemplate only for legacy systems.`,
    tags: ["communication"],
  },
  {
    id: "ms-010",
    question: "How did you secure internal communication between microservices?",
    answer: `"To secure internal microservice communication, we used JWT-based authentication with Keycloak.
 Each service validated the JWT token before processing the request, so only authenticated services could communicate.
All requests were routed through an API Gateway, which handled initial authentication and token validation.
We also used HTTPS for encrypted communication between services.
For some highly sensitive internal endpoints, we added an additional shared secret as an extra security layer."`,
    tags: ["security", "communication"],
  },
  {
    id: "ms-011",
    question: "What is an API Gateway?",
    answer: `"API Gateway is basically the single entry point for all client requests in a microservices architecture.
 Instead of exposing every service directly, we expose only the gateway, and it internally routes the request to the correct microservice.
In my projects, the gateway helped us with:
Routing → It decides which service should handle the request
Authentication & Authorization → Token validation happens here
Rate limiting & throttling
Centralized logging
Hiding internal service URLs
Cross-cutting concerns like CORS and headers
So the main idea is:
 Client never directly talks to microservices — everything goes through the Gateway.
 This makes the architecture cleaner, more secure, and easier to maintain."`,
    tags: ["api-gateway"],
  },
  {
    id: "ms-012",
    question: "What is Service Discovery?",
    answer: `Service discovery is a service where all services will be getting registered.
"In microservices, services are dynamic — they scale up and down, and their IPs keep changing.
 So instead of manually managing URLs, we use Service Discovery.
We register each service into a registry like Eureka.
 Then other services don't need to know the actual IP.
 They simply ask Eureka, and Eureka returns the active instances.
This helps with:
Dynamic load balancing
Avoiding hardcoded URLs
Automatic failover if a service goes down
So basically, Service Discovery lets microservices find each other automatically."`,
    tags: ["service-discovery"],
  },
  {
    id: "ms-013",
    question: "When a user will send a request to a particular service explain the flow api gateway to service discovery and the user-service(any service)?",
    answer: `(Personal answer — fill in based on your project.)`,
    tags: ["service-discovery", "api-gateway"],
  },
  {
    id: "ms-014",
    question: "Does Feign Client call services directly through Eureka, or should it go through API Gateway?",
    answer: `"By default, Feign does not go through the API Gateway.Feign talks directly to the target microservice, and it uses Eureka only to get the service instance location — the IP and port.
So the flow is:
Feign → Eureka → Target Service (Direct call)
This is fine for internal service-to-service communication.

In most real projects, we keep internal calls direct because it's faster and avoids unnecessary hops.
But as per the use cases if we want centralized security, rate limiting, or logging, then we can route Feign through the Gateway as well.So both options are possible — it depends on the architecture decision."`,
    tags: ["communication", "service-discovery"],
  },
  {
    id: "ms-015",
    question: "How does Service Discovery (Eureka) know which service is UP or DOWN?",
    answer: `"In Eureka, when a microservice starts, it registers itself with the Eureka Server.
After that, it keeps sending a heartbeat at regular intervals (usually every 30 seconds).
As long as Eureka receives the heartbeat, it marks the service as UP.
If Eureka does not receive heartbeats for a certain time (around 90 seconds), it assumes the service is DOWN and removes it from the registry."`,
    tags: ["service-discovery"],
  },
  {
    id: "ms-016",
    question: "What if the network is slow—will Eureka remove services unnecessarily?",
    answer: `"Eureka is designed with self-preservation mode.
Eureka has something called self-preservation mode.
If too many heartbeats suddenly stop (like network issue),
 Eureka assumes it's a network problem and does NOT remove services immediately.
This prevents mass removal during temporary failures.`,
    tags: ["service-discovery"],
  },
  {
    id: "ms-016b",
    question: "How does Service Discovery work in Kubernetes?",
    answer: `"In Kubernetes, service discovery is built-in, so we don't need external tools like Eureka.
Kubernetes uses something called a Service object. A Service provides a stable IP address and DNS name for a group of Pods. Even if Pods restart and their IPs change, the Service remains stable.
Internally, Kubernetes uses label selectors to link a Service to the correct Pods. When a Pod is healthy and matches the labels, traffic is routed to it automatically.
Kubernetes also uses readiness and liveness probes for health checks. If a Pod fails a readiness check, it is automatically removed from traffic routing.
So overall, service discovery in Kubernetes is DNS-based and automatically managed by the cluster."`,
    tags: ["service-discovery", "kubernetes"],
  },
  {
    id: "ms-017",
    question: "What is Client-Side Service Discovery and server side discovery?",
    answer: `Client-side discovery → Client decides where to send the request.
Server-side discovery → Load balancer decides where to send the request

✅ 1️⃣ Client-Side Service Discovery
📌 What it is:
In client-side discovery, the client is responsible for finding the service instance.
📌 How it works:
Service instances register themselves in a service registry (like Netflix Eureka).
The client asks the registry for available instances.
The client chooses one instance (using load balancing logic).
The client directly calls that service.


📌 Example:
Order Service wants to call Payment Service.
Order Service asks Eureka: "Give me available Payment instances."
Order Service selects one and calls it directly.


📌 Key Point:
The client handles service lookup + load balancing.

✅ 2️⃣ Server-Side Service Discovery
📌 What it is:
In server-side discovery, the client does NOT look up services directly.
Instead, it calls a load balancer, and the load balancer finds the service instance.
📌 How it works:
Services register in the registry.
Client calls a fixed endpoint (like a load balancer).
Load balancer queries registry.
Load balancer forwards requests to one healthy instance.


📌 Example:
In Kubernetes:
Client calls payment-service
Kubernetes Service routes request to a healthy pod.


📌 Key Point:
Load balancer handles service lookup + routing.`,
    tags: ["service-discovery"],
  },
  {
    id: "ms-018",
    question: "What is load balancing? (Simple, practical answer)",
    answer: `"Load balancing simply means dividing the incoming requests across multiple instances of the same service.
 Instead of all traffic hitting one instance, it gets shared so the system doesn't slow down or crash."

usecase:-
"The purpose is to avoid putting too much load on a single service instance.
 If one instance is busy or goes down, the load balancer sends the traffic to another healthy instance.
 So it helps in handling more traffic and keeps the service available."`,
    tags: ["load-balancing"],
  },
  {
    id: "ms-019",
    question: "What are the Types of Load Balancing?",
    answer: `1️⃣ Client-Side Load Balancing
📌 The client decides which server to call.
Client gets list of service instances
Applies algorithm (Round Robin, etc.)
Calls selected instance directly


Example:
Netflix Eureka
Spring Cloud LoadBalancer


👉 Used in microservices with service registry.

2️⃣ Server-Side Load Balancing
📌 A load balancer acts as bridge between client and servers.
Client sends request to load balancer
Load balancer forwards to one backend server
Examples:
NGINX
AWS ELB
Kubernetes Service
👉 Client doesn't know backend instances.`,
    tags: ["load-balancing"],
  },
  {
    id: "ms-020",
    question: "What types of load balancing algorithms do you know?",
    answer: `Common load balancing strategies include Round Robin, Weighted Round Robin, Least Connections, Random, and IP Hash. Round Robin distributes requests equally, Weighted Round Robin gives more traffic to powerful servers, Least Connections sends traffic to the least busy server, and IP Hash ensures the same client is routed to the same server

1. Round Robin (most common)
"It calls each service instance one by one in a cycle.
 Instance 1 → Instance 2 → Instance 3 → again Instance 1."
This is the default in Ribbon, Feign, Eureka.

2.Weighted Round Robin
Servers with more capacity get more requests.
Example:
Server A (weight 3)
Server B (weight 1)
Traffic ratio:
 A → 3 requests
 B → 1 request
Good when servers have different capacities

3. Random
"It randomly picks any instance."
Simple but not predictable.

4. Least Connections
"Whichever instance has the least active requests — call that one."
Useful for heavy load applications.`,
    tags: ["load-balancing"],
  },
  {
    id: "ms-021",
    question: "What are Ribbon and spring cloud load balancers?",
    answer: `📌 Netflix Ribbon
Ribbon is a client-side load balancer developed by Netflix.
🔹 What it does:
Works with service discovery (like Eureka)
Gets list of service instances
Applies load balancing algorithm (Round Robin, etc.)
Chooses one instance
Sends request directly


🔹 Key Point:
Load balancing happens on the client side.

⚠ Important:
Ribbon is now deprecated in modern Spring Cloud versions.

📌 Spring Cloud LoadBalancer
Spring Cloud LoadBalancer is the modern replacement for Ribbon.
🔹 What it does:
Client-side load balancing
Works with Eureka or other service registries
Uses simple, lightweight implementation
Default algorithm: Round Robin


🔹 Why it replaced Ribbon?
Ribbon was tightly coupled with Netflix stack
Too complex and heavy
Not actively maintained


The Spring Cloud team built their own lightweight solution.`,
    tags: ["load-balancing"],
  },
  {
    id: "ms-022",
    question: "How Feign uses LoadBalancer internally",
    answer: `📌 Step-by-Step Flow
Assume:
Order Service → calls → Payment Service
 Using OpenFeign

1️⃣ You Define Feign Client
@FeignClient(name = "payment-service")
public interface PaymentClient {
    @GetMapping("/pay")
    String pay();
}

Notice:
 We are using a service name, not an IP address.

2️⃣ What Happens Internally?
When Order Service calls:
paymentClient.pay();

Feign does NOT directly call the service.
Instead:
Feign asks Service Discovery (like Eureka)
It gets list of available instances:
payment-service → instance1
payment-service → instance2
Feign delegates selection to:


👉 Spring Cloud LoadBalancer
LoadBalancer applies algorithm (usually Round Robin)
One instance is selected
Feign sends HTTP request to selected instance`,
    tags: ["communication", "load-balancing"],
  },
  {
    id: "ms-023",
    question: "How API Gateway + Load Balancer + Service Discovery work together",
    answer: `This answer will require time to refactor`,
    tags: ["api-gateway", "service-discovery", "load-balancing"],
  },
  {
    id: "ms-024",
    question: "What is Resilience4j OR fault tolerance library? How can we add what is a common dependency that it includes?",
    answer: `Keyword:-
Resilience 4j java library used for making the system more resilience or fault tolerants
Circuit B, Retry, Rate L, Time L, Bulkhead


1.First we need to understand what is fault tolerance :- Fault tolerance means the system can continue its work even if some part of the service will fail or be blocked.
2.Resilience4j is a lightweight java fault tolerance library used in microservices to make the system more resilient (The ability of a system to handle failures and recover quickly without crashing )  when dependent services fail.
3. Resilience 4j provided the different design pattern / features
a. Circuit Breaker
B. Retry Mechanism
C. Rate Limiter
D. Time Limiter
E. BulkHead pattern
4.Circult Breaker is used consider if we have two services service A and Service B due to some reason service B is failing and still service A api keeps calling to service B which makes the performance down  and to avoid this issue we can use circuit breaker to stop repeated calls to falling services.
5. A retry mechanism is used when we doing some logic. It's failing due to some temporary issue like timeout (basically happened when we integrate the third party api) or network glitches so the system can automatically tries again instead of failing the current logic or execution.
6. Time Limiter is used when we want to set a particular api time limit for the api call if the api is taking more than that limit the call will get cancelled.
7. Rate Limiter is about limiting how many api calls can be done in a given time of window.
8. Bulkhead pattern is used to isolate resources like threads so that failure or slowness in one service does not impact other parts of the system, ensuring better stability.

We add the dependency spring-cloud-starter-circuitbreaker-resilience4j, which integrates Resilience4j with Spring Boot and provides circuit breaker and other resilience patterns."`,
    tags: ["resilience"],
  },
  {
    id: "ms-025",
    question: "What is a Circuit Breaker?",
    answer: `keywords:-> circuit breaker, stop repeated calls from failing service, @circuitbreaker annotation

A Circuit Breaker is a design pattern used in microservices to stop repeated calls to a failing service and prevent the entire system from going down.
If one microservice goes down, we don't want other services to keep calling it and waste time.
Circuit Breaker detects failures and stops calls for some time.This helps our system remain responsive and avoids a complete failure.

Circuit Breaker can be implemented in spring boot using @CircuitBreaker annotation where we can define the fallBackmethod like if paymentService is failing due to some reason what response we need to show to the user.
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
public String callPaymentService() {
    return restTemplate.getForObject("http://payment-service/pay", String.class);
}

public String paymentFallback(Exception ex) {
    return "Payment service is currently unavailable";
}


We can define the respective properties in the application properties files like
slidingWindowSize which means it decides last api calls that needs to tracked
failureRateThreashold:- it will decide the give value or more than that threshold is request will failed it will open the Circuit (50 % of api calls failed)
waitDurationInOpenState:- After circuit becomes OPEN, wait for 10 seconds
Then move to HALF-OPEN and test again

permittedNumberOfCallsInHalfOpenState ,
slidingWindowType,
minimumNumberOfCalls
automaticTransitionFromOpenToHalfOpenEnabled


resilience4j:
  circuitbreaker:
    instances:
      paymentService:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s


Implementation:-
In Spring Boot, we usually implement Circuit Breaker using:
👉 Resilience4j
1️⃣ Add Dependency
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>


2️⃣ Enable Circuit Breaker in Method
We use @CircuitBreaker annotation.
Example:
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
public String callPaymentService() {
    return restTemplate.getForObject("http://payment-service/pay", String.class);
}

public String paymentFallback(Exception ex) {
    return "Payment service is currently unavailable";
}


3️⃣ Configure in application.yml
resilience4j:
  circuitbreaker:
    instances:
      paymentService:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s

This means:
If 50% of last 10 requests fail
Circuit becomes OPEN
It waits 10 seconds before trying again`,
    tags: ["resilience", "circuit-breaker"],
  },
  {
    id: "ms-026",
    question: "How does a Circuit Breaker work internally?",
    answer: `Circuit breaker wraps the service call, monitors success and failure using thresholds, and when failures exceed a limit, it stops calling the service and directly executes the fallback method.

It has 3 states:
1️⃣ Closed → Normal working
2️⃣ Open → Stops calling the service
3️⃣ Half-Open → Allows few test calls`,
    tags: ["resilience", "circuit-breaker"],
  },
  {
    id: "ms-027",
    question: "What is the Retry mechanism?",
    answer: `Retry mechanism used  If a request fails due to a temporary issue (like network glitch or api timeout), the system automatically tries again instead of failing immediately.
It is useful for:
Temporary network issues
Short service downtime
Timeout errors
But it should be used carefully to avoid overloading the system.

Implement:-
So while implementing in the spring boot we use the @Retry annotation with its respective properties like defining the fallback method

We can define the
maxAttempts: 3  like how much retry calls can be done if issue found(1 original call + 2 retries
)
waitDuration: 2s Time gap between retries
retryExceptions:
 - java.io.IOException
 Retry only for these exceptions
. ignoreExceptions
ignoreExceptions:
 - java.lang.IllegalArgumentException
👉 Do NOT retry for these
exponentialBackoff (very good to mention)
👉 Instead of fixed wait time, delay increases
Example:
1st retry → 2 sec
2nd retry → 4 sec
3rd retry → 8 sec
✔ Helps avoid overloading system

6. retryOnResult (advanced, optional)
👉 Retry based on response, not exception



Use @Retry Annotation
@Retry(name = "paymentService", fallbackMethod = "fallbackMethod")
public String callPaymentService() {
    return restTemplate.getForObject("http://payment-service/pay", String.class);
}

public String fallbackMethod(Exception ex) {
    return "Payment service is currently unavailable after retries";
}
Note:- 👉 Retry should be used only for idempotent operations

Configure in application.yml
resilience4j:
  retry:
    instances:
      paymentService:
        maxAttempts: 3
        waitDuration: 2s
        retryExceptions:
          - java.io.IOException
        ignoreExceptions:
          - java.lang.IllegalArgumentException


This means:
Try maximum 3 times
Wait 2 seconds between attempts`,
    tags: ["resilience", "retry"],
  },
  {
    id: "ms-028",
    question: "What is a TimeLimiter? (need to refactor)",
    answer: `TimeLimiter sets a maximum time for a call. If a service takes more than that limit, the call gets cancelled immediately."
Example:
If a call takes more than 2 seconds → stop it → return fallback.
TimeLimiter saves your threads from being stuck.

Implementations:-
1️⃣ Add Dependency
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>

2️⃣ Use @TimeLimiter Annotation
@TimeLimiter(name = "paymentService", fallbackMethod = "fallbackMethod")
public CompletableFuture<String> callPaymentService() {

    return CompletableFuture.supplyAsync(() ->
        restTemplate.getForObject("http://payment-service/pay", String.class)
    );
}

public CompletableFuture<String> fallbackMethod(Exception ex) {
    return CompletableFuture.completedFuture("Service took too long to respond");
}

⚠ Notice:
 The return type must be CompletableFuture.
TimeLimiter requires CompletableFuture because it works on asynchronous non-blocking calls, allowing it to cancel the execution if it exceeds the configured timeout.

3️⃣ Configuration in application.yml
resilience4j:
  timelimiter:
    instances:
      paymentService:
        timeoutDuration: 3s

This means:
If response takes more than 3 seconds
Timeout occurs
Fallback method is executed`,
    tags: ["resilience", "time-limiter"],
  },
  {
    id: "ms-029",
    question: "What is a Rate Limiter? (need to refactor)",
    answer: `A rate limiter controls how many requests a client can make in a given time window to protect the system from overload or abuse.
Example 1:-
Allow max 100 requests per minute per user; extra requests are rejected or delayed.`,
    tags: ["resilience", "rate-limiter"],
  },
  {
    id: "ms-030",
    question: "What is the bulkhead design pattern?",
    answer: `Bulkhead pattern means isolating different parts of a system so that failure in one part does not affect the entire system.
 It limits resources like threads or concurrent calls for a specific service. If one service becomes slow or fails, it does not affect other parts of the application
Types of Bulkhead (Resilience4j)

Using Resilience4j, there are two types:
1️⃣ Semaphore Bulkhead
Limits number of concurrent calls
Simple and lightweight


2️⃣ Thread Pool Bulkhead
Uses separate thread pools
More isolation`,
    tags: ["resilience", "bulkhead"],
  },
  {
    id: "ms-031",
    question: "What pattern do you want to understand?",
    answer: `1. Resilience & Fault-Tolerance Patterns
Circuit Breaker
Bulkhead
Retry
Timeout
Fallback

2. Data Management Patterns

Database per Service
Shared Database (anti-pattern)
Saga Pattern
CQRS
Event Sourcing
Distributed Transactions (2PC – usually avoided)

3. Decomposition & Architecture Patterns
Decompose by Business Capability
Decompose by Subdomain
API Gateway
Strangler Fig


4. Service Discovery & Communication Patterns
Service Registry & Discovery
Client-Side Discovery
Server-Side Discovery
Sidecar
API Composition


5. Deployment & Infrastructure Patterns
Blue-Green Deployment
Canary Deployment
Service Mesh
Ambassador
Anti-Corruption Layer`,
    tags: ["patterns"],
  },
  {
    id: "ms-032",
    question: "What is database per service design pattern?",
    answer: `Each microservice has its own database.
Order Service → Order DB
Payment Service → Payment DB
Inventory Service → Inventory DB


Other services cannot directly access another service's database.
✔ Loose coupling
✔ Independent deployment
✔ Better scalability
This is the most recommended approach.`,
    tags: ["patterns", "data"],
  },
  {
    id: "ms-033",
    question: "What is Shared Database (Anti-Pattern)",
    answer: `👉 Multiple services share the same database.
Example:
Order and Payment use the same DB tables.


❌ Tight coupling
❌ Hard to scale
❌ Hard to change schema
❌ Breaks microservice principle
Generally avoided.`,
    tags: ["patterns", "data"],
  },
  {
    id: "ms-034",
    question: "What is Saga Pattern",
    answer: `What is it?
Used to manage transactions across multiple services.because each service has its own DB,
we cannot use traditional distributed transactions.
Saga handles this using:
Local transactions
Event-based communication
Compensation actions if something fails

Saga is a distributed transaction management pattern used in microservices.
 Instead of one big DB transaction, it breaks a transaction into multiple local transactions with compensation steps if something fails.

When to use Saga?
In microservices (no shared database)
When a business process spans multiple services
When ACID transactions are not possible
Example: Order → Payment → Inventory → Shipping


Saga Types
1. Choreography Saga (Event-based)
Services communicate via events
No central controller
OrderCreated → PaymentService → InventoryService → ShippingService

2. Orchestration Saga (Central Co-ordinator
A Saga Orchestrator controls the flow
Sends commands to services


Orchestrator → Payment → Inventory → Shipping`,
    tags: ["patterns", "data", "saga"],
  },
  {
    id: "ms-035",
    question: "What is CQRS?",
    answer: `Answer:
 CQRS stands for Command Query Responsibility Segregation.
 It's a design pattern where we separate the operations that change data (commands) from the operations that read data (queries).
Command: "Do something" → create, update, delete (mutates state)
Query: "Get something" → fetch data (reads state)
We use CQRS when:
Read and write workloads are very different
Reads might be 10x more frequent than writes.
Example: e-commerce product catalog → lots of queries, few updates.
We need scalable architecture
Commands and queries can have separate models and databases.
Example: Writes go to the main DB, reads go to a read-optimized replica or cache.
Complex domains / audit logging
CQRS works well with Event Sourcing (storing every state change as an event).
Example: Banking → every transaction is an immutable event, queries can reconstruct balances.
Security / permissions
Commands can have stricter validation/security rules than queries.`,
    tags: ["patterns", "cqrs"],
  },
  {
    id: "ms-036",
    question: "How does CQRS work in real projects?",
    answer: `Answer (friendly example):
 Imagine a healthcare app:
Command:
Nurse updates a patient's vitals → this triggers a command handler that writes to the database.
Query:
The doctor views the patient dashboard → this hits a read-optimized model, maybe even cached.


Here, reads and writes don't interfere with each other, so high read traffic doesn't slow down writes.`,
    tags: ["patterns", "cqrs"],
  },
  {
    id: "ms-037",
    question: "Do we always need two databases in CQRS?",
    answer: `Answer:
 No, not always.
CQRS can be implemented in a single database — just using separate models for reading and writing.
But in large-scale systems, we often use different databases:
Write DB → transactional, normalized (OLTP)
Read DB → denormalized, optimized for queries (OLAP / materialized views)
This is where CQRS shines: read and write models can evolve independently.`,
    tags: ["patterns", "cqrs"],
  },
  {
    id: "ms-038",
    question: "How have you implemented CQRS in your projects?",
    answer: `"In my project, we had a healthcare system where nurses frequently updated patient vitals, and doctors were constantly reading dashboards.
 I implemented CQRS with separate command handlers and query handlers.
 Commands are written to a normalized table in the main database, and queries read from a denormalized read model optimized with indexes and caching.
 This improved read performance without affecting write operations, and allowed us to add audit logging easily."`,
    tags: ["patterns", "cqrs", "interview"],
  },
  {
    id: "ms-039",
    question: "What does BFF stand for?",
    answer: `Backend For Frontend It means: Instead of having one common backend for all clients,
We create a separate backend service for each frontend type.

🧠 Why Do We Need BFF?
Different clients have different needs:
Web app
Mobile app
Admin dashboard


Each client:
Needs different data
Different response format
Different performance optimization


If we use one common backend:
It becomes complex
Too many condition checks
Over-fetching or under-fetching data


BFF solves this.

How It Works
Example:
Microservices:
Order Service
Payment Service
User Service


Instead of frontend calling all services directly:
We create:
Web-BFF
Mobile-BFF


Flow:
Frontend → BFF → Microservices

The BFF:
Aggregates data
Transforms response
Handles authentication
Reduces number of API calls`,
    tags: ["patterns", "bff"],
  },
  {
    id: "ms-040",
    question: "What is the event source?",
    answer: `"Event Sourcing is a design pattern where instead of storing the current state of data, we store every change as an event. The current state is rebuilt by replaying those events. It provides full history and supports event-driven systems.

An Event Store is a database that stores events in order.
Each event contains:
Event type (OrderCreated, PaymentCompleted)
Data (payload)
Timestamp
Aggregate ID (like OrderId)
Event Store can be:
A relational database (table storing events)
NoSQL database
Kafka (as event log)
Specialized Event Store DB`,
    tags: ["patterns", "event-sourcing"],
  },
  {
    id: "ms-041",
    question: "Difference between microservice & distributed microservice architecture?",
    answer: `Microservices is an architectural style where an application is divided into small independent services.
A distributed system means those services are deployed across multiple machines and communicate over a network.
So the key difference is that microservices define how we design the system, while distributed systems define how those services are deployed and the challenges they introduce, like network latency and fault tolerance.`,
    tags: ["fundamentals"],
  },
  {
    id: "ms-042",
    question: "What are different types of deployment strategies that you know?",
    answer: `1. 🔵 Blue-Green Deployment
Maintain two environments: Blue (current) and Green (new)
Switch traffic from Blue → Green once ready


👉 Natural line:
We keep two identical environments and switch traffic to the new version once it is stable.
✔ Pros: Zero downtime, easy rollback
 ❗ Cons: Costly (need double infrastructure)


2. Rolling Deployment
Gradually update instances one by one


👉 Natural line:
Instead of updating everything at once, we update servers in batches.
✔ Pros: No downtime, cost-effective
 ❗ Cons: Old and new versions run together

3. Canary Deployment
Release to a small set of users first
If everything works → release to all users


👉 Natural line:
We test the new version with a small group of users before full rollout.
✔ Pros: Reduced risk
 ❗ Cons: Requires monitoring

4. Recreate Deployment
Stop old version → deploy new version


Natural line:
We shut down the old version and then deploy the new one.
Pros: Simple
Cons: Downtime

5. 🟣 A/B Testing Deployment
Different versions shown to different users


👉 Natural line:
We release multiple versions and compare user behavior.
✔ Pros: Helps in decision making
 ❗ Cons: Complex setup`,
    tags: ["deployment"],
  },
  {
    id: "ms-043",
    question: "How to Handle Versioning in Microservices?",
    answer: `Keyword:-
Version managing different version of api/service
Use URL version api/v1/odres or v2/orders
User Header versioning by defining versioning defining in the controller
@GetMapping(value = "/orders", headers = "Accept=application/vnd.myapp.v1+json")




Versioning is basically way which allows us to manage different version of the same api/service so that changes don't break the existing flows
In microservices or monolithic services api versioning can be done by providing the URL versioning mean providing the endpoint like api/v1/orders -> api/v2/order meaning the api gateway here will route the respective request to particular versions this is common approach that we can do while maintaining the versioning
Second approach is we can use header versioning as well so at the controller level we can distinguish the request for same endpoint for different headers like we will take the v1+json version from header and in the controller we will provide the logic to intercept that to particular method like we have orderV1() and orderV2() method from orderService.
@GetMapping(value = "/orders", headers = "Accept=application/vnd.myapp.v1+json")
public ResponseEntity getV1() {}
@GetMapping(value = "/orders", headers = "Accept=application/vnd.myapp.v2+json")
public ResponseEntity getV2() {}
Note:-> In most real-world microservices, URI versioning is preferred.`,
    tags: ["versioning"],
  },
  {
    id: "ms-044",
    question: "How to enable/disable API versions during deployment?",
    answer: `keywords;->
Use @ConditionOnProperty by defining the respective properties in the yml or properties file
Use api gateway routing or configuration route the request
Deployment strategies(blue green deployment gradually routing traffic)



1.  so  while doing the deployment we don't do it manually we can use the @ConditionalOnProperty annotation which takes the feature flag which enable or disable from application properties like
Api.v1.enable = true or api.v2.enable = false
2. We can use the deployment strategies like blue gree deployment where we deploy v2 version with v1 and gradually shifts traffic from v1 to v2
3. Also we can implement mainly on api gateway level where we can route the request directly on v2 version and block or stop the v1 api.`,
    tags: ["versioning", "deployment"],
  },
];

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: "microservices",
    name: "Microservices",
    description: "Architecture, patterns, communication, and resilience.",
    cards: MICROSERVICES,
  },
];
