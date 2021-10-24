// import type { InitialOptionsTsJest } from 'ts-jest/dist/types'
// import { defaults as tsjPreset } from 'ts-jest/presets'

// const config: InitialOptionsTsJest = {
//   transform: {
//     ...tsjPreset.transform,
//   },
//   moduleFileExtensions: [
//     "js",
//     "json",
//     "ts"
//   ],
//   rootDir: "src",
//   testRegex: ".*\\.spec\\.ts$",
//   collectCoverageFrom: [
//     "**/*.(t|j)s"
//   ],
//   testPathIgnorePatterns: [
//     "/node_modules/",
//     "/build/"
//   ],
//   coverageDirectory: "../coverage",
//   testEnvironment: "node",
//   preset: "ts-jest",
//   setupFiles: ["dotenv/config"]
// }

// export default config
export default {
  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  // The glob patterns Jest uses to detect test files
  testMatch: [
    //"**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "/node_modules/",
    "/build/"
  ],
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',  
  setupFilesAfterEnv: ["jest-extended/all"]
};