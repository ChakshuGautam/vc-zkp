const generateIncludeStatement = (circuitsDir: string, fileName: string) => {
  return `include "${circuitsDir}/${fileName}" ;`;
};

const generateCircomGreaterEqualThanX = (x: number): string => {
  return ` 
pragma circom 2.0.0;

${generateIncludeStatement('src/circuits', 'comparators.circom')}


template GreaterEqualThanX(x, n) {
    signal input i;
    signal output out;

    component gte = GreaterEqThan(n);

    gte.in[0] <== i;
    gte.in[1] <== x;

    gte.out ==> out;

    assert(gte.out == 1);
}

component main = GreaterEqualThanX(${x}, 3);
`;
};

export { generateCircomGreaterEqualThanX };
