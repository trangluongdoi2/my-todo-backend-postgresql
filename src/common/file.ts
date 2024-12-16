export function getFileNameWithoutExtension(fileName: string = '') {
  const [nameWithoutExtension] = fileName.split(/(?=\.[^.]+$)/);
  return nameWithoutExtension ?? '';
}
export function getExtensionFile(fileName: string = '') {
  return fileName.split('.').pop() ?? '';
}
