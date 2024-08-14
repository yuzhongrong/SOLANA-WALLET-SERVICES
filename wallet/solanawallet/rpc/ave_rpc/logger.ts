import pino from 'pino';
// import chalk from 'chalk';
const transport = pino.transport({
    target: 'pino-pretty',
  });
  
  export const logger = pino(
    {
      level: 'info',
      redact: ['poolKeys'],
      serializers: {
        error: pino.stdSerializers.err,
      },
      base: undefined,
    },
    transport,
  );