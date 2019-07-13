// tslint:disable: no-string-literal

import { TypesGenerator } from './typesGenerator';
import { createTestScheme } from './specHelper';

describe('[v2] typesGenerator', () => {
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

    const converter = new TypesGenerator(schema);
    const defs = converter.loadTypes();
    expect(defs).toBeDefined();
    expect(defs.length).toBe(1);

    const def1 = defs[0];
    expect(def1.name).toBe('test');
    expect(def1.isGeneric).toBe(false);
    expect(def1.properties).toBeDefined();
    expect(def1.properties.length).toBe(2);
    expect(def1.properties[0].type).toBe('integer');
    expect(def1.properties[1].type).toBe('string');
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

    const converter = new TypesGenerator(schema);
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
    expect(def1.properties[1].required).toBe(true);
    expect(def1.properties[2].required).toBe(false);
  });
});
