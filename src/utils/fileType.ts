export default (path: string) => {
  const index: number = path.lastIndexOf(`.`);
  return index !== -1 ? path.substring(index + 1, path.length).toLowerCase() : ``
}
