module.exports = {
  clearMocks: true,
  modulePathIgnorePatterns: ["<rootDir>/node_modules"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json"
      }
    ]
  },
  watchPathIgnorePatterns: ["<rootDir>/node_modules"]
};
