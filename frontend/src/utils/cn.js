
const cn = (...classes) => {
  return classes
    .reduce((acc, val) => {
      if (typeof val === 'string') {
        return acc + (acc ? ' ' : '') + val;
      }
      if (typeof val === 'object' && val !== null) {
        return (
          acc +
          (acc ? ' ' : '') +
          Object.entries(val)
            .filter(([_, condition]) => condition)
            .map(([className]) => className)
            .join(' ')
        );
      }
      return acc;
    }, '')
    .trim();
};

export default cn;
