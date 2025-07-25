/**
 * @description Inline variable containing function call
 * @command refakts inline-variable "[function-call.input.ts 8:10-8:17]"
 */

function processString(text: string): string {
  return text.trim().toUpperCase();
}