import { uniqueNamesGenerator, adjectives, names, NumberDictionary } from "unique-names-generator";

const numberDictionary = NumberDictionary.generate({ min: 0, max: 99999 });
/**
 * Generates and returns a unique username
 * @returns string
 */
export default function generateUsername(): string {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, names, numberDictionary],
        length: 3,
        separator: "-"
      })
}