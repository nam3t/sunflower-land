module.exports = {
  clearMocks: true,
  modulePathIgnorePatterns: ["<rootDir>/node_modules"],
  moduleNameMapper: {
    "^lib/(.*)$": "<rootDir>/../../src/lib/$1",
    "^features/(.*)$": "<rootDir>/../../src/features/$1",
    "^assets/(.*)$": "<rootDir>/../../test/fileTransform.js",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        astTransformers: {
          before: [
            {
              path: "<rootDir>/test/transformers/importMetaUrl.cjs"
            }
          ]
        },
        tsconfig: "<rootDir>/tsconfig.test.json"
      }
    ]
  },
  watchPathIgnorePatterns: ["<rootDir>/node_modules"]
};
