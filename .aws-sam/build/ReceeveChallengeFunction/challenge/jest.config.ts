import type { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { defaults as tsjPreset } from 'ts-jest/presets'

const config: InitialOptionsTsJest = {
  transform: {
    ...tsjPreset.transform,
  },
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "__tests__",
  testRegex: ".*\\.spec\\.ts$",
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  preset: "ts-jest",
  setupFiles: ["dotenv/config"]
}

export default config