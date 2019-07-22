import { resolveSpec, getOperations } from './spec';
import genJsCode from './gen/js';
import { removeOldFiles } from './tools/util';
import * as assert from 'assert';
import { SpecLoader } from './tools/specLoader';
import { OperationLoader } from './v2/operationLoader';
import { TypesSerializer } from './v2/typeSerializer';
import { TypesConverter } from './v2/typesConverter';

export function genCode(options: ClientOptions): Promise<any> {
  return verifyOptions(options).then((opts: ClientOptions) => {
    if (opts.newEngine) {
      return processNewEngine(options.src);
    }
    return resolveSpec(options.src, { ignoreRefType: '#/definitions/' }).then((spec) =>
      gen(spec, opts)
    );
  });
}

function verifyOptions(options: ClientOptions): Promise<any> {
  try {
    assert.ok(options.src, 'Open API src not specified');
    assert.ok(options.outDir, 'Output directory not specified');
    return Promise.resolve(options);
  } catch (e) {
    return Promise.reject(e);
  }
}

function gen(spec: ApiSpec, options: ClientOptions): ApiSpec {
  removeOldFiles(options);
  const operations = getOperations(spec);
  return genJsCode(spec, operations, options);
}

function processNewEngine(src: string): Promise<any> {
  const specLoader = new SpecLoader();
  return specLoader.loadV2Schema(src).then((schema) => {
    const opLoader = new OperationLoader(schema);
    const typesConverter = new TypesConverter(schema);
    const typesSerializer = new TypesSerializer(schema);
    const operations = opLoader.loadOperations();
    const types = typesConverter.loadTypes();

    const res = typesSerializer.process(types);
    console.log(res);
  });
}
