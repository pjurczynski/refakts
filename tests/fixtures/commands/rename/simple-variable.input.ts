/**
 * @description Rename a simple local variable
 * @command refakts rename "[simple-variable.input.ts 7:9-7:16]" --to "newName"
 */

function calculateArea(width: number, height: number): number {
  const oldName = width * height;
  return oldName * 2;
}