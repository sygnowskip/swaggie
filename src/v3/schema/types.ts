export interface ISchemaV3 {
  /**
   * This is the version of the OpenAPI Specification used.
   * This is not related to the API info.version string.
   */
  openapi: string;

  /**
   * Provides metadata about the API. The metadata MAY be used by tooling as required.
   */
  info: ISchemaInfo;

  /**
   * An array of Server Objects, which provide connectivity information to a target server.
   * If the servers property is not provided, or is an empty array,
   * the default value would be a Server Object with a url value of
   */
  servers?: [ISchemaServer];

  /**
   * The available paths and operations for the API.
   */
  paths: { [path: string]: any }; // TODO: Specify types

  /**
   * An element to hold various schemas for the specification.
   */
  components?: any;

  /**
   * A declaration of which security mechanisms can be used across the API.
   * The list of values includes alternative security requirement objects that can be used.
   * Only one of the security requirement objects need to be satisfied to authorize a request.
   * Individual operations can override this definition.
   */
  security?: any[];

  /**
   * A list of tags used by the specification with additional metadata.
   * The order of the tags can be used to reflect on their order by the parsing tools.
   * Not all tags that are used by the Operation Object must be declared.
   * The tags that are not declared MAY be organized randomly or based on the tools' logic.
   * Each tag name in the list MUST be unique.
   */
  tags?: ISchemaTag[];

  /**
   * Additional external documentation.
   */
  externalDocs?: ISchemaExternalDocs;
}

export interface ISchemaInfo {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ISchemaContact;
  license?: ISchemaLicense;
  version: string;
}

export interface ISchemaContact {
  name: string;
  url: string;
  email: string;
}

export interface ISchemaLicense {
  name: string;
  url: string;
}

export interface ISchemaServer {
  name: string;
  description: string;
  variables: { [variableName: string]: any };
}

export interface ISchemaExternalDocs {
  description?: string;
  url: string;
}

export interface ISchemaTag {
  description?: string;
  name: string;
  externalDocs: ISchemaExternalDocs;
}
