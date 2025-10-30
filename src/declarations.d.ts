// Allow importing any .jsx file as a module
declare module "*.jsx" {
  const value: any;
  export default value;
}
