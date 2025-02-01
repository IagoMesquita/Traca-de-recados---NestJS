import { HasingServiceProtocol } from './hashing.protocol.service';
import * as bcrypt from 'bcrypt';

export class BcryptService extends HasingServiceProtocol {
  async toHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
  async compare(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);

    return isMatch;
  }
}
