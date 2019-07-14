import { ISchemaV2, FieldType, FieldFormat, ISchemaProperty, ISchemaObject } from './schema/types';
import * as _ from 'lodash';

export class TypesConverter {
  constructor(private schema: ISchemaV2) {}

  loadTypes(): IDefinition[] {
    const defs = this.getDefinitionsList().map(
      (d) =>
        ({
          type: d.type,
          originalName: d.name,
          isGeneric: d.name.indexOf('[') > -1,
          name: getName(d.name),
          description: d.description,
          secondType: getSecondType(d.name),
          properties: getProperties(d),
        } as IDefinition)
    );

    return this.removeGenericsDuplicates(defs);
  }

  private getDefinitionsList(): IExtSchemaObject[] {
    return Object.keys(this.schema.definitions).map((name) =>
      Object.assign(
        {
          name,
          propertiesList: getPropertiesList(this.schema.definitions[name].properties as any),
        },
        this.schema.definitions[name]
      )
    );
  }

  /**
   * After converting types to proper generics, we will have duplicates
   * And we need to get rid of them
   */
  private removeGenericsDuplicates(defs: IDefinition[]): IDefinition[] {
    return _.uniqBy<IDefinition>(defs, (def) => def.name);
  }
}

function getPropertiesList(props?: {
  [name: string]: IPropertyDefinition;
}): INamedPropertyDefinition[] {
  if (!props) {
    return [];
  }
  return Object.keys(props).map((name) => Object.assign({ name }, props[name]));
}

function getName(name: string): string {
  if (name.indexOf('[') === -1) {
    return name;
  }

  return name.substring(0, name.indexOf('['));
}

function getSecondType(name: string): string {
  if (name.indexOf('[') === -1) {
    return null;
  }

  return name.substring(name.indexOf('[') + 1, name.indexOf(']'));
}

function getProperties(type: IExtSchemaObject): INamedPropertyDefinition[] {
  if (!type.propertiesList || type.propertiesList.length === 0) {
    return [];
  }

  return type.propertiesList.map<INamedPropertyDefinition>((p: IExtSchemaObject) => ({
    readOnly: p.readOnly || false,
    example: p.example,
    type: p.type,
    required: !!type.required && type.required.indexOf(p.name) > -1,
    name: p.name,
  }));
}

export interface IDefinition {
  type: FieldType;
  isGeneric: boolean;
  originalName: string;
  description?: string;
  name: string;
  secondType: string;
  properties: INamedPropertyDefinition[];
}

export interface IPropertyDefinition {
  type: FieldType;
  format?: FieldFormat;
  items?: ISchemaProperty;
  description?: string;
  enum?: string[];
  fullEnum?: { [name: string]: any };
  readOnly?: boolean;
  required: boolean;
  example: any;
}

export interface IExtSchemaObject extends ISchemaObject {
  name: string;
  propertiesList: IExtSchemaProperty[];
}

export interface IExtSchemaProperty extends ISchemaProperty {
  name: string;
}

export interface INamedPropertyDefinition extends IPropertyDefinition {
  name: string;
}
