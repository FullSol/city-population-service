// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

// Register the fastify-formbody plugin
fastify.register(require("@fastify/formbody"));

// Import routes
const populationRoutes = require("./routes/api/populationRoutes");

// Register routes
fastify.register(populationRoutes);

// Run the server!
fastify.listen({ port: 5555 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
