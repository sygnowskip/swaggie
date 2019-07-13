import { ISchemaV2 } from './schema/types';

export function createTestScheme(content: Partial<ISchemaV2>): ISchemaV2 {
  const def: ISchemaV2 = {
    swagger: '2',
    definitions: {},
    info: {
      title: 'Test',
      version: '123',
    },
    paths: {},
  };

  return Object.assign({}, def, content);
}
