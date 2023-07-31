const generateIncludeStatement = (circuitsDir: string, fileName: string) => {
  return `include "${circuitsDir}/${fileName}" ;`;
};

const generateCircomGreaterEqualThanX = (): string => {
  return ` 
pragma circom 2.0.0;

${generateIncludeStatement('src/circuits', 'comparators.circom')}


template GreaterEqualThanX(n) {
    signal input i;
    signal input x; 
    signal output out;

    component gte = GreaterEqThan(n);

    gte.in[0] <== i;
    gte.in[1] <== x;

    gte.out ==> out;

    gte.out === 1;
  }
  
  component main { public [ x ] } = GreaterEqualThanX(10);
`;
};

export { generateCircomGreaterEqualThanX };
