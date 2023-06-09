# vc-zkp

The `ZKP` class is used to demonstrate the principles of Zero-Knowledge Proofs (ZKPs) in a simplified form. It uses cryptographic hash functions to verify whether a certain attribute exists in a JsonLD document or whether an attribute's value is greater than a specified number, without revealing the actual value of the attribute.

## Class Properties

- `document: JsonLdDocument` - The JsonLD document to be processed.
- `attribute: string` - The name of the attribute to be checked.
- `consent: Consent` - The consent object containing information about API usage limit and current usage count.

## Class Methods

- `constructor(document: JsonLdDocument, attribute: string, consent: Consent)`: Initializes a new instance of the ZKP class.

- `checkConsent(): boolean`: Checks whether the API usage limit defined in the consent has been reached.

- `incrementUsage(): void`: Increments the current API usage count by one.

- `checkAttributeExists(proverAttribute: string): boolean`: Verifies whether the provided attribute's hashed value matches the hashed value of the document's attribute.

- `checkAttributeGreaterThan(value: number): boolean`: Verifies whether the document's attribute value is greater than the provided value.

- `checkAttributeLessThan(value: number): boolean`: Verifies whether the document's attribute value is less than the provided value.

- `checkAttributeEqualTo(value: any): boolean`: Verifies whether the document's attribute value is equal to the provided value.

- `checkAttributeInRange(min: number, max: number): boolean`: Verifies whether the document's attribute value is within the specified range.

Each method automatically checks the consent and increments the usage count. If the usage limit is exceeded, an error is thrown.

## Consent Interface

The `Consent` interface represents a consent object used to limit the number of times API methods can be accessed.

- `attribute: string` - The name of the attribute for which the consent is given.
- `limit: number` - The maximum number of times the API can be accessed.
- `currentUsage: number` - The current number of times the API has been accessed.

