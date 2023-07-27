import { ZKP, JsonLdDocument, Consent } from '../src';

describe('ZKP Class', () => {
  let jsonLdDocument: JsonLdDocument;
  let consent: Consent;

  beforeEach(() => {
    jsonLdDocument = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name: 'John Doe',
      age: 25,
    };

    consent = {
      attribute: 'age',
      limit: 5,
      currentUsage: 0,
    };
  });

  it('should initialize without errors', () => {
    const jsonLdDocument = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name: 'John Doe',
      age: 25,
    };

    const consent = {
      attribute: 'age',
      limit: 6,
      currentUsage: 0,
    };
    const zkp = new ZKP(jsonLdDocument, 'age', consent);
    expect(zkp).toBeInstanceOf(ZKP);
  });

  it('should checkAttributeExists correctly', () => {
    const zkp = new ZKP(jsonLdDocument, 'age', consent);
    expect(zkp.checkAttributeExists('25')).toBe(true);
    expect(zkp.checkAttributeExists('26')).toBe(false);
  });

  it('should checkAttributeGreaterThan correctly', () => {
    const zkp = new ZKP(jsonLdDocument, 'age', consent);
    expect(zkp.checkAttributeGreaterThan(20)).toBe(true);
    expect(zkp.checkAttributeGreaterThan(30)).toBe(false);
  });

  it('should generate and verify proof correctly', async () => {
    const zkp = new ZKP(jsonLdDocument, 'age', consent);
    const response = await zkp.checkAttributeGreaterEqualThan(20);
    const validProof = await zkp.verifyProofcheckAttributeGreaterEqualThan(
      20,
      response.proof!
    );

    expect(validProof).toBe(true);
  });

  it('should throw error if usage limit is exceeded', () => {
    const zkp = new ZKP(jsonLdDocument, 'age', consent);
    for (let i = 0; i < 5; i++) {
      zkp.checkAttributeGreaterThan(20);
    }
    expect(() => zkp.checkAttributeGreaterThan(20)).toThrow(
      'API usage limit reached'
    );
  });
});

jest.setTimeout(30000);
