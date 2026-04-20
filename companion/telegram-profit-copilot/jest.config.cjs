module.exports = {
  clearMocks: true,
  modulePathIgnorePatterns: ["<rootDir>/node_modules"],
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.server.json"
      }
    ]
  },
  watchPathIgnorePatterns: ["<rootDir>/node_modules"]
};
