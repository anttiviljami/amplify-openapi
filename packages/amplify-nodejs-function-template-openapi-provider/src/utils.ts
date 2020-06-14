import path from 'path';

// Converts files to a map of file to destination filename
// removes .ejs from file extension and appends src to the path
// ['a.js.ejs', 'b.json'] => {'a.js.ejs': 'src/a.js', 'b.json': 'src/b.json'}
export const getDestMap = (files: string[]): { [key: string]: string } =>
  files.reduce((acc, it) => Object.assign(acc, { [it]: path.join('src', it.replace(/\.ejs$/, '')) }), {});
