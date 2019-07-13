// tslint:disable: no-string-literal

import { OperationConverter } from './operationConverter';
import { ISchemaV2 } from './schema/types';

describe('[v2] operationConverter', () => {

  it(`should convert operation correctly`, () => {
    const schema: ISchemaV2 = {
      swagger: '2',
      definitions: {},
      info: {
        title: 'Test',
        version: '123',
      },
      paths: {
        '/api/heartbeat': {
          get: {
            tags: ['System'],
            summary: 'System health check',
            operationId: 'ApiHeartbeatGet',
            consumes: [],
            produces: ['application/json'],
            parameters: [],
            responses: {
              200: {
                description: 'Service is available.',
                schema: {
                  $ref: '#/definitions/HeartBeatResponse',
                },
                examples: {
                  'application/json': {
                    version: '1.2.3',
                    environment: 'QA',
                  },
                },
              },
              401: {
                description: 'Unauthorized',
              },
              403: {
                description: 'Forbidden',
              },
            },
          },
        },
      },
    };

    const converter = new OperationConverter(schema);
    const ops = converter.loadOperations();
    expect(ops).toBeDefined();
    expect(ops.length).toBe(1);

    const op = ops[0];
    expect(op.id).toBe('ApiHeartbeatGet');
    expect(op.path).toBe('/api/heartbeat');
    expect(op.method).toBe('get');
    expect(op.group).toBe('System');
    expect(op.responses).toBeDefined();
    expect(op.responses.length).toBe(3);
    expect(op.responses[0].code).toBe('200');
    expect(op.responses[0].description).toBe('Service is available.');
    expect(op.responses[1].code).toBe('401');
    expect(op.responses[1].description).toBe('Unauthorized');
    expect(op.responses[2].code).toBe('403');
    expect(op.responses[2].description).toBe('Forbidden');
  });

  it(`should apply endpoint's parameters properly to all of it's operations`, () => {
    const schema: ISchemaV2 = {
      swagger: '2',
      definitions: {},
      info: {
        title: 'Test',
        version: '123',
      },
      paths: {
        '/api/heartbeat': {
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              type: 'integer',
              format: 'int64',
            },
          ],
          get: {
            tags: ['System'],
            summary: 'System health check',
            operationId: 'ApiHeartbeatGet',
            consumes: [],
            produces: ['application/json'],
            parameters: [],
            responses: {
              200: {
                description: 'Ok',
              },
            },
          },
          post: {
            tags: ['System'],
            summary: 'System health check',
            operationId: 'ApiHeartbeatPost',
            consumes: [],
            produces: ['application/json'],
            parameters: [
              {
                name: 'id',
                in: 'query',
                required: true,
                type: 'integer',
                format: 'int64',
              },
            ],
            responses: {
              200: {
                description: 'Ok',
              },
            },
          },
        },
      },
    };

    const converter = new OperationConverter(schema);
    const ops = converter.loadOperations();
    expect(ops).toBeDefined();
    expect(ops.length).toBe(2);

    const op1 = ops[0];
    expect(op1.id).toBe('ApiHeartbeatGet');
    expect(op1.parameters).toBeDefined();
    expect(op1.parameters.length).toBe(1);
    expect(op1.parameters[0].name).toBe('userId');

    const op2 = ops[1];
    expect(op2.id).toBe('ApiHeartbeatPost');
    expect(op2.method).toBe('post');
    expect(op2.parameters).toBeDefined();
    expect(op2.parameters.length).toBe(2);
    expect(op2.parameters[0].name).toBe('id');
    expect(op2.parameters[1].name).toBe('userId');
  });

  describe('createOpId', () => {
    const converter = new OperationConverter({} as any);

    it('should get operationId correctly #1', () => {
      const opId = converter['createOpId']('get', {
        operationId: null,
        path: null,
      });

      expect(opId).toBe('get');
    });

    it('should get operationId correctly #2', () => {
      const opId = converter['createOpId']('get', {
        operationId: null,
        path: '/api/heartbeat',
      });

      expect(opId).toBe('getApiHeartbeat');
    });

    it('should get operationId correctly #3', () => {
      const opId = converter['createOpId']('get', {
        operationId: null,
        path: 'api/heart-beat',
      });

      expect(opId).toBe('getapiHeartBeat');
    });

    it('should get operationId correctly #4', () => {
      const opId = converter['createOpId']('get', {
        operationId: null,
        path: undefined,
      });

      expect(opId).toBe('get');
    });

    it('should get operationId from operationId if present', () => {
      const opId = converter['createOpId']('get', {
        operationId: 'testName',
        path: 'api/heart-beat',
      });

      expect(opId).toBe('testName');
    });
  });

  describe('getGroupName', () => {
    const converter = new OperationConverter({} as any);

    it('should get default group name #1', () => {
      const opId = converter['getGroupName'](null);

      expect(opId).toBe('default');
    });

    it('should get default group name #2', () => {
      const opId = converter['getGroupName'](undefined);

      expect(opId).toBe('default');
    });

    it('should get default group name #3', () => {
      const opId = converter['getGroupName']([]);

      expect(opId).toBe('default');
    });

    it('should get group name correctly #1', () => {
      const opId = converter['getGroupName'](['TestName']);

      expect(opId).toBe('TestName');
    });

    it('should get group name correctly #2', () => {
      const opId = converter['getGroupName'](['test_name']);

      expect(opId).toBe('test_name');
    });

    it('should get group name correctly #3', () => {
      const opId = converter['getGroupName'](['test/name-aaa']);

      expect(opId).toBe('testnameaaa');
    });
  });
});
