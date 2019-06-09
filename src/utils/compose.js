export default (...funcs) => components => funcs.reduceRight(
  (component, fn) => fn(component),
  components,
);
