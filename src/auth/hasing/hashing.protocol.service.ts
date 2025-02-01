export abstract class HasingServiceProtocol {
  abstract toHash(password: string): Promise<string>;

  abstract compare(password: string, hash: string): Promise<boolean>;
} 