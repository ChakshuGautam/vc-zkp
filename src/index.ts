import crypto from 'crypto';
import { GenerateProofResponseInterface } from './common/interfaces/generateProof';
import { generateProofGreaterEqualX } from './utils/proofGenerator';

interface JsonLdDocument {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

interface Consent {
  attribute: string;
  limit: number;
  currentUsage: number;
}

class ZKP {
  public document: JsonLdDocument;
  public attribute: string;
  private hash: string;
  private value: any;
  private consent: Consent;

  constructor(document: JsonLdDocument, attribute: string, consent: Consent) {
    this.document = document;
    this.attribute = attribute;
    this.consent = consent;
    if (this.document[this.attribute]) {
      this.hash = crypto
        .createHash('sha256')
        .update(this.document[this.attribute].toString())
        .digest('hex');
      this.value = this.document[this.attribute];
    } else {
      throw new Error('Attribute not found in the document');
    }
    if (this.consent.attribute !== attribute) {
      throw new Error('Consent attribute does not match document attribute');
    }
  }

  checkConsent(): boolean {
    return this.consent.currentUsage < this.consent.limit;
  }

  incrementUsage(): void {
    if (this.checkConsent()) {
      this.consent.currentUsage++;
    } else {
      throw new Error('API usage limit reached');
    }
  }

  checkAttributeExists(proverAttribute: string): boolean {
    this.incrementUsage();
    const proverHash = crypto
      .createHash('sha256')
      .update(proverAttribute)
      .digest('hex');
    return proverHash === this.hash;
  }

  checkAttributeGreaterThan(value: number): boolean {
    this.incrementUsage();
    return this.value > value;
  }

  checkAttributeGreaterEqualThan(
    value: number
  ): Promise<GenerateProofResponseInterface> {
    this.incrementUsage();

    return generateProofGreaterEqualX(value, this.value);
  }

  checkAttributeLessThan(value: number): boolean {
    this.incrementUsage();
    return this.value < value;
  }

  checkAttributeEqualTo(value: any): boolean {
    this.incrementUsage();
    return this.value === value;
  }

  checkAttributeInRange(min: number, max: number): boolean {
    this.incrementUsage();
    return this.value >= min && this.value <= max;
  }
}

export { ZKP, JsonLdDocument, Consent };
