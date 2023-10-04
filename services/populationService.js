class PopulationService {
  constructor(model) {
    this.model = model;
  }

  _createValidation(newObject) {
    const error = [];

    const city = { value: newObject.city };
    const state = { value: newObject.state };
    const population = { value: newObject.population };
    const response = { city, state, population };

    if (!this._validateCityOrStateName(city.value)) {
      error.push("City must be a valid name");
    }

    if (!this._validateCityOrStateName(state.value)) {
      error.push("State must be a valid name");
    }

    if (isNaN(population.value)) {
      error.push("Population must be numeric");
    }

    if (error.length > 0) response.error = error;

    return response;
  }

  _validateCityOrStateName(name) {
    const cityStateRegex = /^[A-Z][a-zA-Z\s]*[^0-9]$/;
    const test = cityStateRegex.test(name);

    return test;
  }

  _formatStrings(string) {
    // First letter of each word should be capitalized
    const stringArray = string.toLowerCase().split(" ");
    for (var i = 0; i < stringArray.length; i++) {
      stringArray[i] =
        stringArray[i].charAt(0).toUpperCase() + stringArray[i].slice(1);
    }

    const newString = stringArray.join(" ");

    return newString;
  }

  async readByCityState(city, state) {
    try {
      // Validations
      if (state === null || state == "")
        throw new Error("Must provide a valid state parameter");
      if (city === null || city == "")
        throw new Error("Must provide a valid state parameter");

      // Format to alleviate capitalization issues
      state = this._formatStrings(state);
      city = this._formatStrings(city);

      // Attempt to find the population
      const result = await this.model.findByCityState(state, city);

      // Check for appropriate response
      if (result === null) throw new Error("Population not Found");

      // return results
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateOrAdd(populationObject) {
    try {
      const updateObject = {
        ...populationObject,
        population: parseInt(populationObject.population, 10),
        state: this._formatStrings(populationObject.state),
        city: this._formatStrings(populationObject.city),
      };

      // Validate the new object
      const { error } = this._createValidation(updateObject);
      if (error) {
        throw new Error(error);
      }

      // Attempt to add or update the data
      const result = await this.model.updateOrAdd(updateObject);

      // Return the result
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PopulationService;
