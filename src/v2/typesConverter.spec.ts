// tslint:disable: no-string-literal

import { TypesConverter } from './typesConverter';
import { createTestScheme } from './specHelper';

describe('[v2] typesConverter', () => {
  it(`should map correctly basic types`, () => {
    const schema = createTestScheme({
      definitions: {
        test: {
          type: 'object',
          properties: {
            id: {
              format: 'int32',
              type: 'integer',
              readOnly: true,
            },
            name: {
              type: 'string',
              readOnly: true,
            },
          },
        },
      },
    });

    const converter = new TypesConverter(schema);
    const defs = converter.loadTypes();
    expect(defs).toBeDefined();
    expect(defs.length).toBe(1);

    const def1 = defs[0];
    expect(def1.name).toBe('test');
    expect(def1.isGeneric).toBe(false);
    expect(def1.properties).toBeDefined();
    expect(def1.properties.length).toBe(2);
    expect(def1.properties[0].type).toBe('integer');
    expect(def1.properties[0].required).toBe(false);
    expect(def1.properties[1].type).toBe('string');
    expect(def1.properties[1].required).toBe(false);
  });

  it(`should map correctly generic types`, () => {
    const schema = createTestScheme({
      definitions: {
        'PagedAndSortedQuery[User]': {
          required: ['page', 'count'],
          type: 'object',
          properties: {
            page: {
              format: 'int32',
              type: 'integer',
            },
            count: {
              format: 'int32',
              type: 'integer',
            },
            sortField: {
              type: 'string',
            },
          },
        },
      },
    });

    const converter = new TypesConverter(schema);
    const defs = converter.loadTypes();
    expect(defs).toBeDefined();
    expect(defs.length).toBe(1);

    const def1 = defs[0];
    expect(def1.name).toBe('PagedAndSortedQuery');
    expect(def1.originalName).toBe('PagedAndSortedQuery[User]');
    expect(def1.isGeneric).toBe(true);
    expect(def1.secondType).toBe('User');
    expect(def1.properties).toBeDefined();
    expect(def1.properties.length).toBe(3);
    expect(def1.properties[0].required).toBe(true);
    expect(def1.properties[0].name).toBe('page');
    expect(def1.properties[1].required).toBe(true);
    expect(def1.properties[1].name).toBe('count');
    expect(def1.properties[2].required).toBe(false);
    expect(def1.properties[2].name).toBe('sortField');
  });

  it(`should remove correctly duplicate generic types`, () => {
    const schema = createTestScheme({
      definitions: {
        'PagedAndSortedQuery[User]': {
          type: 'object',
          properties: {
            count: {
              format: 'int32',
              type: 'integer',
            },
          },
        },
        'PagedAndSortedQuery[Role]': {
          type: 'object',
          properties: {
            count: {
              format: 'int32',
              type: 'integer',
            },
          },
        },
        'SomethingElse[User]': {
          type: 'object',
          properties: {
            sortField: {
              type: 'string',
            },
          },
        },
      },
    });

    const converter = new TypesConverter(schema);
    const defs = converter.loadTypes();
    expect(defs).toBeDefined();
    expect(defs.length).toBe(2);

    const def1 = defs[0];
    expect(def1.name).toBe('PagedAndSortedQuery');
    expect(def1.isGeneric).toBe(true);
    expect(def1.properties).toBeDefined();
    expect(def1.properties.length).toBe(1);

    const def2 = defs[1];
    expect(def2.name).toBe('SomethingElse');
    expect(def2.isGeneric).toBe(true);
    expect(def2.properties).toBeDefined();
    expect(def2.properties.length).toBe(1);
  });
});
