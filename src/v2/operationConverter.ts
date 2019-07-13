import {
  ISchemaV2,
  ISchemaOperation,
  ISecurityRequirement,
  ISchemaOperationRequest,
  ISchemaPath,
  ISchemaReference,
  ISchemaOperationResult,
} from './schema/types';
import {
  HttpMethod,
  ApiOperationParam,
  ApiOperationResponse,
  ApiOperationSecurity,
} from './tempTypes';

const SUPPORTED_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const DEF_GROUP_NAME = 'default';

export class OperationConverter {
  constructor(private schema: ISchemaV2) {}

  loadOperations(): IOperation[] {
    return this.getPaths().reduce<IOperation[]>(
      (operations, current) => operations.concat(this.getPathOperations(current)),
      []
    );
  }

  private getPaths(): IExtendedPathTemp[] {
    return Object.keys(this.schema.paths).map((path) =>
      Object.assign({ path }, this.schema.paths[path])
    );
  }

  private getPathOperations(operation: IExtendedPathTemp): IOperation[] {
    return Object.keys(operation)
      .filter((key) => !!~SUPPORTED_METHODS.indexOf(key))
      .map((method) =>
        this.getPathOperation(method as HttpMethod, { ...operation[method], path: operation.path })
      );
  }

  private getPathOperation(method: HttpMethod, pathInfo: IExtendedPath): IOperation {
    const op: IOperation = {
      method,
      path: pathInfo.path,
      parameters: pathInfo.parameters,
      id: this.createOpId(method, pathInfo),
      ...pathInfo[method],
      responses: this.getOperationResponses(pathInfo.responses),
      security: this.getOperationSecurity(pathInfo.security),
      group: this.getGroupName(pathInfo.tags),
    };

    this.applyOperationPaths(op, pathInfo);

    return op;
  }

  private createOpId(method: HttpMethod, op: Partial<IExtendedPath>): string {
    if (op.operationId) {
      return op.operationId;
    }

    return (method + (op.path || ''))
      .replace(/[\/{(?\/{)\-]([^{.])/g, (_, m) => m.toUpperCase())
      .replace(/[\/}\-]/g, '');
  }

  /** Apply global operation params to all methods */
  private applyOperationPaths(op: IOperation, pathInfo: IExtendedPath) {
    const pathParams = this.schema.paths[pathInfo.path].parameters;
    if (pathParams) {
      pathParams.forEach((pathParam) => {
        if (!op.parameters.some((p) => p.name === pathParam.name && p.in === pathParam.in)) {
          op.parameters.push(Object.assign({}, pathParam));
        }
      });
    }
  }

  private getGroupName(tags: string[]): string {
    return (tags && tags.length ? tags[0] : DEF_GROUP_NAME)
      .replace(/[^$_a-z0-9]+/gi, '')
      .replace(/^[0-9]+/m, '');
  }

  private getOperationSecurity(opSecurity: ISecurityRequirement): ISecurityRequirement {
    if (opSecurity === undefined) {
      return this.schema.security;
    }
    return opSecurity;
  }

  private getOperationResponses(opResponses: {
    [status: string]: ISchemaOperationResult | ISchemaReference;
  }): IExtendedOperationRequest[] {
    return Object.keys(opResponses || {}).map((code) => {
      const info = opResponses[code] as IExtendedOperationRequest;
      info.code = code;
      return info;
    });
  }
}

export interface IOperation {
  id: string;
  summary: string;
  description: string;
  method: HttpMethod;
  group: string;
  path: string;
  parameters: ApiOperationParam[];
  responses: ApiOperationResponse[];
  security?: ApiOperationSecurity[];
  consumes: string[];
  produces: string[];
  tags?: string[];
}

export interface IExtendedPath extends ISchemaOperation {
  path: string;
}

interface IExtendedOperationRequest extends ISchemaOperationRequest {
  code: string;
}

interface IExtendedPathTemp extends ISchemaPath {
  path: string;
}
