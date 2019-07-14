import { ISchemaV2 } from './schema/types';
import { IDefinition } from './typesConverter';

export class TypesSerializer {
  constructor(private schema: ISchemaV2) {}

  process(defs: IDefinition[]): string {
    return defs.map((d) => this.mapDefinition(d)).join('\n');
  }

  private mapDefinition(def: IDefinition): string {
    if (def.type !== 'object') {
      console.warn(
        `Unable to render ${def.name} with type ${def.type}. We support only object types for the global definitions`
      );
      return '';
    }

    return `${getComment(def.description)}export interface ${def.name}${
      def.isGeneric ? '<T>' : ''
    } {
  ${def.properties.map(
    (p) => `${getComment(p.description)}${p.name}${p.required ? '?' : ''}: ${p.type};`
  )}
}
`;
  }
}

function getComment(desc?: string) {
  if (!desc || desc.length === 0) {
    return '';
  }

  return `/**
  * ${desc}
  */
 `;
}
