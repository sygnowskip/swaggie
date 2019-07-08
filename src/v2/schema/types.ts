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
   * The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss".
   */
  schemes?: [string];

  /**
   * A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls.
   */
  consumes?: [string];

  /**
   * A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls.
   */
  produces?: [string];

  /** The available paths and operations for the API. */
  paths: { [path: string]: ISchemaPath };

  /** An object to hold data types produced and consumed by operations. */
  definitions: string;

  /**
   * An object to hold parameters that can be used across operations.
   * This property does not define global parameters for all operations.
   */
  parameters?: string;

  /**
   * An object to hold responses that can be used across operations.
   * This property does not define global responses for all operations.
   */
  responses?: string;

  /** Security scheme definitions that can be used across the specification. */
  securityDefinitions?: string;

  /**
   * A declaration of which security schemes are applied for the API as a whole.
   * The list of values describes alternative security schemes that can be used
   * (that is, there is a logical OR between the security requirements).
   * Individual operations can override this definition.
   */
  security?: string;

  /**
   * A list of tags used by the specification with additional metadata.
   * The order of the tags can be used to reflect on their order by the parsing tools.
   * Not all tags that are used by the Operation Object must be declared.
   * The tags that are not declared may be organized randomly or based on the tools' logic.
   * Each tag name in the list MUST be unique.
   */
  tags?: string;

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
  tags?: [string];
  summary?: string;
  description?: string;
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
  consumes?: [string];

  /**
   * A list of MIME types the operation can produce This overrides the consumes definition at the Swagger Object.
   * An empty value MAY be used to clear the global definition. Value MUST be as described under Mime Types.
   */
  produces?: [string];
  parameters?: [ISchemaOperationRequest | ISchemaReference];
  responses: { [status: string]: ISchemaOperationResult | ISchemaReference };
  schemes?: [string];
  deprecated?: boolean;
  security?: { [def: string]: any };
}

export interface ISchemaExternalDocs {
  description?: string;
  url: string;
}

export interface ISchemaOperationRequest {
  /** Required. The name of the parameter. Parameter names are case sensitive.
   * If in is "path", the name field MUST correspond to the associated path segment
   * from the path field in the Paths Object. See Path Templating for further information.
   * For all other cases, the name corresponds to the parameter name used based on the in property.
   */
  name: string;

  /**
   * 	Required. The location of the parameter. Possible values are "query", "header", "path", "formData" or "body".
   */
  in: string;

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
   * Required. A short description of the response. GFM syntax can be used for rich text representation.
   */
  description: string;

  /**
   * Object	A definition of the response structure. It can be a primitive, an array or an object.
   * If this field does not exist, it means no content is returned as part of the response.
   * As an extension to the Schema Object, its root type value may also be "file".
   * This SHOULD be accompanied by a relevant produces mime-type.
   */
  schema?: any;

  /**
   * Object	A list of headers that are sent with the response.
   */
  headers?: { [header: string]: ISchemaHeaderDefinition };

  /**
   * Object	An example of the response message.
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
  enum?: [any];
  multipleOf?: number;
}
