module.exports = {
  modulePaths: ['/shared/vendor/modules'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'bower_components', 'shared'],

  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
    "^axios$": "axios/dist/node/axios.cjs"
  },

  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.js'],
  testEnvironment: 'jsdom',
  maxWorkers: 4,
  maxConcurrency: 2,  
};
