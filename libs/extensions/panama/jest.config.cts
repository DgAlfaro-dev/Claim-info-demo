module.exports = {
  displayName: 'panama',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { 
      tsconfig: '<rootDir>/tsconfig.spec.json',
      jsx: 'react'
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/extensions/panama',
  moduleNameMapper: {
    '^@claim-info-demo/core$': '<rootDir>/../../../dist/libs/core/src/index.js'
  }
};
