/**
 * @description Extract variable from inside conditional block
 * @command refakts extract-variable "[conditional-block.input.ts 7:7-7:15]" --name "userAge"
 */

function checkAge(user: { age: number }) {
  if (user.age >= 18) {
    console.log('Adult user');
    return true;
  }
  return false;
}