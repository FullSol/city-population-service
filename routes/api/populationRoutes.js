// Data service to interface with the file storage system.
const DataService = require("../../services/populationDataService");
const dataService = new DataService();
dataService.initData();

// Data model for populations
const Model = require("../../models/population");
const model = new Model(dataService);

// Population service for business logic
const Service = require("../../services/populationService");
const service = new Service(model);

async function route(fastify, options) {
  fastify.get(
    "/api/population/state/:state/city/:city",
    async (request, reply) => {
      try {
        const { state, city } = request.params;

        const result = await service.readByCityState(city, state);
        reply.status(200).send({ population: result });
      } catch (error) {
        reply.status(400).send(error.message);
      }
    }
  );
  fastify.put(
    "/api/population/state/:state/city/:city",
    async (request, reply) => {
      try {
        const { state, city } = request.params;
        const population = request.body;

        // Data object to send to service
        const populationObject = {
          city: city,
          state: state,
          population: population,
        };

        const result = await service.updateOrAdd(populationObject);

        if (result === 1)
          reply.status(200).send("Successfully updated population");
        else reply.status(201).send({ population: result });
      } catch (error) {
        reply.status(400).send({ error: error.message });
      }
    }
  );
}

module.exports = route;
