const fs = require("fs");
const csvWriteStream = require("csv-write-stream");
const path = require("path");

class DataService {
  constructor() {
    const relativePath = "../data/city_populations.csv";
    const absolutePath = path.resolve(__dirname, relativePath);
    this.filePath = absolutePath;
    this.writer = csvWriteStream({ sendHeaders: false });

    // Initialize the CSV file with headers if it's empty
    if (!fs.existsSync(this.filePath)) {
      this.writer.pipe(fs.createWriteStream(this.filePath));
    }
  }

  initData() {
    try {
      this._readData();
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  getData() {
    return this.data;
  }

  _readData() {
    try {
      const jsonData = [];

      const fileContents = fs.readFileSync(this.filePath, "utf8");

      // Assuming the CSV has headers and you want to use them as column names
      const rows = fileContents
        .trim() // Remove leading/trailing whitespaces
        .split("\n") // Split into lines
        .map((line) => line.split(",")) // Split each line into columns
        .slice(1); // Remove the header row if it exists

      for (const row of rows) {
        const [city, state, population] = row;
        if (!jsonData[state]) {
          jsonData[state] = [];
        }
        jsonData[state].push({ [city]: parseInt(population, 10) });
      }

      this.data = jsonData;

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateOrAddLine(updatedData) {
    try {
      const fileContent = fs.readFileSync(this.filePath, "utf8");

      // Split the file content into lines
      const lines = fileContent.split("\n");

      // Find the index of the line that matches the updated data
      const lineIndex = lines.findIndex((line) => {
        const [city, state] = line.split(",");

        return city === updatedData.city && state === updatedData.state;
      });

      if (lineIndex !== -1) {
        // Update the population in the existing line
        const parts = lines[lineIndex].split(",");
        parts[2] = updatedData.population.toString();
        lines[lineIndex] = parts.join(",");

        // Write the modified content back to the file
        fs.writeFileSync(this.filePath, lines.join("\n"));

        return 1;
      } else {
        // If no match is found, add a new line
        const newDataLine = [
          updatedData.city,
          updatedData.state,
          updatedData.population,
        ].join(",");
        lines.push(newDataLine);

        // Write the modified content back to the file
        fs.writeFileSync(this.filePath, lines.join("\n"));

        // Return the new line information. This is to mimic Sequelize created return.
        // This should be updated to a validated object in a real environment.
        return updatedData;
      }
    } catch (error) {
      throw new Error("Error updating or adding data:", error);
    }
  }
}

module.exports = DataService;
