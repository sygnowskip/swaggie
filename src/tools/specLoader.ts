import * as YAML from 'js-yaml';
import * as httpClient from 'got';
import { ISchemaV2 } from '../v2/schema/types';
import { ISchemaV3 } from '../v3/schema/types';

export class SpecLoader {
  loadV2Schema(src: string): Promise<ISchemaV2> {
    return this.loadFile(src).then((spec) => spec as ISchemaV2);
  }

  loadV3Schema(src: string): Promise<ISchemaV3> {
    return this.loadFile(src).then((spec) => spec as ISchemaV3);
  }

  private loadFile(src: string): Promise<any> {
    if (/^https?:\/\//im.test(src)) {
      return this.loadFromUrl(src);
    } else if (String(process) === '[object process]') {
      return this.readLocalFile(src).then((contents) => this.parseFileContents(contents, src));
    } else {
      throw new Error(`Unable to load api from '${src}'`);
    }
  }

  private loadFromUrl(url: string) {
    return httpClient(url)
      .then((resp) => resp.body)
      .then((contents) => this.parseFileContents(contents, url));
  }

  private readLocalFile(filePath: string): Promise<string> {
    return new Promise((res, rej) =>
      require('fs').readFile(filePath, 'utf8', (err, contents) => (err ? rej(err) : res(contents)))
    );
  }

  private parseFileContents(contents: string, path: string): object {
    return /.ya?ml$/i.test(path) ? YAML.safeLoad(contents) : JSON.parse(contents);
  }
}
