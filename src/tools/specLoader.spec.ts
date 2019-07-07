// tslint:disable:max-line-length
import { SpecLoader } from './specLoader';

const petstore2 = {
  json: 'http://petstore.swagger.io/v2/swagger.json',
  yaml:
    'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml',
};

const petstore3 = {
  json:
    'https://gist.githubusercontent.com/yhnavein/4225d93d3c7b5acdb6f58375d088ce56/raw/072554207fe403e22948f984e120e45c5edaaa3f/petstore.json',
  yaml:
    'https://gist.githubusercontent.com/yhnavein/4225d93d3c7b5acdb6f58375d088ce56/raw/072554207fe403e22948f984e120e45c5edaaa3f/petstore.yml',
};

describe('SpecLoader', () => {
  let specLoader: SpecLoader;

  beforeEach(() => {
    specLoader = new SpecLoader();
  });

  describe('v2', () => {
    it('should load correctly remote JSON schema from URL', async () => {
      const spec = await specLoader.loadV2Schema(petstore2.json);
      expect(spec).toBeDefined();
      expect(spec.paths).toBeDefined();
      expect(spec.info).toBeDefined();
      expect(spec.definitions).toBeDefined();
    });

    it('should load correctly remote YAML schema from URL', async () => {
      const spec = await specLoader.loadV2Schema(petstore2.yaml);
      expect(spec).toBeDefined();
      expect(spec.paths).toBeDefined();
      expect(spec.info).toBeDefined();
      expect(spec.definitions).toBeDefined();
    });

    it('should resolve a YAML spec from local file', async () => {
      const path = `${__dirname}/../../test/v2/petstore.yml`;
      const spec = await specLoader.loadV2Schema(path);
      expect(spec).toBeDefined();
      expect(spec.paths).toBeDefined();
      expect(spec.info).toBeDefined();
      expect(spec.definitions).toBeDefined();
    });
  });

  describe('v3', () => {
    it('should load correctly remote JSON schema from URL', async () => {
      const spec = await specLoader.loadV3Schema(petstore3.json);
      expect(spec).toBeDefined();
      expect(spec.paths).toBeDefined();
      expect(spec.info).toBeDefined();
      expect(spec.components).toBeDefined();
    });

    it('should load correctly remote YAML schema from URL', async () => {
      const spec = await specLoader.loadV3Schema(petstore3.yaml);
      expect(spec).toBeDefined();
      expect(spec.paths).toBeDefined();
      expect(spec.info).toBeDefined();
      expect(spec.components).toBeDefined();
    });

    it('should resolve a YAML spec from local file', async () => {
      const path = `${__dirname}/../../test/v3/petstore.yml`;
      const spec = await specLoader.loadV3Schema(path);
      expect(spec).toBeDefined();
      expect(spec.paths).toBeDefined();
      expect(spec.info).toBeDefined();
      expect(spec.components).toBeDefined();
    });
  });
});
