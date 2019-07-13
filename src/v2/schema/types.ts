export type SchemaType = 'http' | 'https' | 'ws' | 'wss';

export interface ISchemaV2 {
  /** Specifies the Swagger Specification version being used */
  swagger: string;

  /** Provides metadata about the API. The metadata can be used by the clients if needed. */
  info: ISchemaInfo;

  /**
   * The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths.
   * It MAY include a port.
   */
  host?: string;

  /**
   * The base path on which the API is served, which is relative to the host.
   * If it is not included, the API is served directly under the host.
   * The value MUST start with a leading slash (/). The basePath does not support path templating.
   */
  basePath?: string;

  /**
   * The transfer protocol of the API
   */
  schemes?: SchemaType[];

  /**
   * A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls.
   */
  consumes?: string[];

  /**
   * A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls.
   */
  produces?: string[];

  /** The available paths and operations for the API. */
  paths: { [path: string]: ISchemaPath };

  /** An object to hold data types produced and consumed by operations. */
  definitions: any;

  /**
   * An object to hold parameters that can be used across operations.
   * This property does not define global parameters for all operations.
   */
  parameters?: { [name: string]: ISchemaOperationRequest };

  /**
   * An object to hold responses that can be used across operations.
   * This property does not define global responses for all operations.
   */
  responses?: ISchemaResponseDefinitions;

  /**
   * Security scheme definitions that can be used across the specification.
   */
  securityDefinitions?: { [def: string]: ISecurityScheme };

  /**
   * A declaration of which security schemes are applied for the API as a whole.
   * The list of values describes alternative security schemes that can be used
   * (that is, there is a logical OR between the security requirements).
   * Individual operations can override this definition.
   */
  security?: ISecurityRequirement;

  /**
   * A list of tags used by the specification with additional metadata.
   * The order of the tags can be used to reflect on their order by the parsing tools.
   * Not all tags that are used by the Operation Object must be declared.
   * The tags that are not declared may be organized randomly or based on the tools' logic.
   * Each tag name in the list MUST be unique.
   */
  tags?: ISchemaTag[];

  /** Additional external documentation. */
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

export interface ISchemaPath {
  $ref?: string;
  get?: ISchemaOperation;
  put?: ISchemaOperation;
  post?: ISchemaOperation;
  delete?: ISchemaOperation;
  options?: ISchemaOperation;
  head?: ISchemaOperation;
  patch?: ISchemaOperation;
  parameters?: any[];
}

export interface ISchemaOperation {
  /**
   * A list of tags for API documentation control.
   * Tags can be used for logical grouping of operations by resources or any other qualifier.
   */
  tags?: string[];

  /**
   * A short summary of what the operation does.
   * For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.
   */
  summary?: string;

  /**
   * A verbose explanation of the operation behavior. GFM syntax can be used for rich text representation.
   */
  description?: string;

  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: ISchemaExternalDocs;

  /**
   * Unique string used to identify the operation. The id MUST be unique among all operations described in the API.
   * Tools and libraries MAY use the operationId to uniquely identify an operation, therefore,
   * it is recommended to follow common programming naming conventions.
   */
  operationId?: string;

  /**
   * A list of MIME types the operation can consume. This overrides the consumes definition at the Swagger Object.
   * An empty value MAY be used to clear the global definition. Value MUST be as described under Mime Types.
   */
  consumes?: string[];

  /**
   * A list of MIME types the operation can produce This overrides the consumes definition at the Swagger Object.
   * An empty value MAY be used to clear the global definition. Value MUST be as described under Mime Types.
   */
  produces?: string[];

  /**
   * A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item,
   * the new definition will override it, but can never remove it. The list MUST NOT include duplicated parameters.
   * A unique parameter is defined by a combination of a name and location. The list can use
   * the Reference Object to link to parameters that are defined at the Swagger Object's parameters.
   * There can be one "body" parameter at most.
   */
  parameters?: Array<ISchemaOperationRequest | ISchemaReference>;

  /**
   * The list of possible responses as they are returned from executing this operation.
   */
  responses: { [status: string]: ISchemaOperationResult | ISchemaReference };

  /**
   * The transfer protocol for the operation.
   * The value overrides the Swagger Object schemes definition.
   */
  schemes?: SchemaType[];

  /**
   * Declares this operation to be deprecated. Usage of the declared operation should be refrained.
   * Default value is false.
   */
  deprecated?: boolean;

  /**
   * A declaration of which security schemes are applied for this operation.
   * The list of values describes alternative security schemes that can be used
   * (that is, there is a logical OR between the security requirements).
   * This definition overrides any declared top-level security.
   * To remove a top-level security declaration, an empty array can be used.
   */
  security?: ISecurityRequirement;
}

export interface ISecurityRequirement {
  [def: string]: string[];
}

export interface ISchemaResponseDefinitions {
  [name: string]: ISchemaOperationRequest;
}

export interface ISchemaExternalDocs {
  description?: string;
  url: string;
}

export interface ISchemaOperationRequest {
  /**
   * The name of the parameter. Parameter names are case sensitive.
   * If in is "path", the name field MUST correspond to the associated path segment
   * from the path field in the Paths Object. See Path Templating for further information.
   * For all other cases, the name corresponds to the parameter name used based on the in property.
   */
  name: string;

  /**
   * The location of the parameter.
   */
  in: 'query' | 'header' | 'path' | 'formData' | 'body';

  /**
   * A brief description of the parameter. This could contain examples of use.
   * GFM syntax can be used for rich text representation.
   */
  description?: string;

  /**
   * Determines whether this parameter is mandatory.
   * If the parameter is in "path", this property is required and its value MUST be true.
   * Otherwise, the property MAY be included and its default value is false.
   */
  required?: boolean;

  schema?: any;

  type?: string;

  format?: string;
  allowEmptyValue?: boolean;
}

export interface ISchemaOperationResult {
  /**
   * A short description of the response. GFM syntax can be used for rich text representation.
   */
  description: string;

  /**
   * A definition of the response structure. It can be a primitive, an array or an object.
   * If this field does not exist, it means no content is returned as part of the response.
   * As an extension to the Schema Object, its root type value may also be "file".
   * This SHOULD be accompanied by a relevant produces mime-type.
   */
  schema?: any;

  /**
   * A list of headers that are sent with the response.
   */
  headers?: { [header: string]: ISchemaHeaderDefinition };

  /**
   * An example of the response message.
   */
  examples?: { [mimeType: string]: any };
}

export interface ISchemaReference {
  $ref: string;
}

export interface ISchemaHeaderDefinition {
  description?: string;
  type: string;
  format?: string;
  items?: any;
  collectionFormat?: string;
  default?: any;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  enum?: any[];
  multipleOf?: number;
}

export interface ISecurityScheme {
  /**
   * The type of the security scheme. Valid values are "basic", "apiKey" or "oauth2".
   */
  type: string;

  /**
   * A short description for security scheme.
   */
  description?: string;

  /**
   * The name of the header or query parameter to be used.
   */
  name: string;

  /**
   * The location of the API key. Valid values are "query" or "header".
   */
  in: 'query' | 'header';

  /**
   * The flow used by the OAuth2 security scheme.
   * Valid values are "implicit", "password", "application" or "accessCode".
   */
  flow: string;

  /**
   * The authorization URL to be used for this flow. This SHOULD be in the form of a URL.
   */
  authorizationUrl: string;

  /**
   * The token URL to be used for this flow. This SHOULD be in the form of a URL.
   */
  tokenUrl: string;

  /**
   * The available scopes for the OAuth2 security scheme.
   */
  scopes: { [name: string]: string };
}

export interface ISchemaTag {
  /** The name of the tag. */
  name: string;

  /** A short description for the tag. GFM syntax can be used for rich text representation. */
  description?: string;

  /** Additional external documentation for this tag. */
  externalDocs?: ISchemaExternalDocs;
}
