class Population {
  constructor(dataService) {
    this.dataService = dataService;
    this.data = this.dataService.getData();
  }

  findByCityState(state, city) {
    // Check if the state exists in the data
    if (this.data[state]) {
      // Find the city in the state's array
      const cityData = this.data[state].find(
        (item) => Object.keys(item)[0] === city
      );

      // If the city is found, return its population
      if (cityData) {
        return cityData[city];
      }
    }

    // If state or city is not found, return null
    return null;
  }

  async updateOrAdd(populationObject) {
    const { city, state, population } = populationObject;
    if (!this.data[state]) {
      this.data[state] = [];
    }

    const cityIndex = this.data[state].findIndex(
      (item) => Object.keys(item)[0] === city
    );

    if (cityIndex !== -1) {
      // Update existing city
      this.data[state][cityIndex][city] = population;
    } else {
      // Add new city
      this.data[state].push({
        [city]: population,
      });
    }

    try {
      // Attempt to add or update population to file
      const result = this.dataService.updateOrAddLine(populationObject);

      // Return results
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Population;
