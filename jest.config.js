module.exports = {
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/*.(spec|test).(ts|js)'],
    testURL: 'http://localhost/',
    coverageDirectory: '../coverage',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    }
};