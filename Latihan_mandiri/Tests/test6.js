function feast(beast, dish) {
  if (beast[0] == dish[0] && beast[beast.length - 1] == dish[dish.length - 1]) {
    return true;
  } else {
    return false;
  }
}
// console.log(feast("browr", "bear"));

let bones = "Forgotten Bones";
console.log(bones.slice(0, bones.length));
