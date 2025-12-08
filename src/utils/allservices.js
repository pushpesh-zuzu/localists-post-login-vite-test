export function changeSequenceServices(array, fromIndex) {
  if (fromIndex > 0 && fromIndex < array.length) {
    const newArr = array.slice();
    const [item] = newArr.splice(fromIndex, 1);
    return [item, ...newArr];
  }
  return array.slice();
}
