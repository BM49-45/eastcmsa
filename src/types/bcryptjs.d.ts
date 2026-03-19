// src/types/bcryptjs.d.ts
declare module 'bcryptjs' {
  /**
   * Generates a salt synchronously
   * @param rounds Number of rounds to use, default 10
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Generates a salt asynchronously
   * @param rounds Number of rounds to use, default 10
   */
  export function genSalt(rounds?: number): Promise<string>;
  export function genSalt(rounds: number, callback: (err: Error | null, salt: string) => void): void;
  export function genSalt(callback: (err: Error | null, salt: string) => void): void;

  /**
   * Hashes a string synchronously
   * @param s String to hash
   * @param salt Salt or number of rounds
   */
  export function hashSync(s: string, salt: string | number): string;

  /**
   * Hashes a string asynchronously
   * @param s String to hash
   * @param salt Salt or number of rounds
   */
  export function hash(s: string, salt: string | number): Promise<string>;
  export function hash(s: string, salt: string | number, callback: (err: Error | null, hash: string) => void, progress?: (percent: number) => void): void;
  export function hash(s: string, salt: string | number, progress: (percent: number) => void): Promise<string>;

  /**
   * Compares a string with a hash synchronously
   * @param s String to compare
   * @param hash Hash to compare against
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Compares a string with a hash asynchronously
   * @param s String to compare
   * @param hash Hash to compare against
   */
  export function compare(s: string, hash: string): Promise<boolean>;
  export function compare(s: string, hash: string, callback: (err: Error | null, success: boolean) => void): void;

  /**
   * Gets the number of rounds used to hash a password
   * @param hash Hash to extract rounds from
   */
  export function getRounds(hash: string): number;
}