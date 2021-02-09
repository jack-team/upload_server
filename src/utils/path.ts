import path from 'path';

const rootPath: string = process.cwd();

export default (_path: string) => (
  path.join(rootPath, _path)
);
