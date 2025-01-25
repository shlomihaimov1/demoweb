import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'node'],
  roots: ['<rootDir>/tests'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/controllers/usersController.ts',
    '<rootDir>/src/routes/users.ts'
  ]
};

export default config;