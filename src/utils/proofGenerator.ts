import { GenerateProofResponseInterface } from '../common/interfaces/generateProof';
import { generateCircomGreaterEqualThanX } from './circomGenerator';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, readFile, unlink, rmdir } from 'fs/promises';
import { execShellCommand } from './execShellCommand';

const generateProofGreaterEqualX = async (
  x: number,
  value: number
): Promise<GenerateProofResponseInterface> => {
  try {
    const circomId = uuidv4();

    await writeFile(`${circomId}.circom`, generateCircomGreaterEqualThanX(x));

    await writeFile(
      `${circomId}.input.json`,
      `{
      "i": ${value}
    }
    `
    );

    await execShellCommand(`circom ${circomId}.circom --r1cs --wasm`);
    await execShellCommand(`snarkjs powersoftau new bn128 12 tmp.ptau`);
    await execShellCommand(
      `snarkjs powersoftau prepare phase2 tmp.ptau ${circomId}.ptau`
    );
    await execShellCommand(`rm tmp.ptau`);
    await execShellCommand(
      `snarkjs groth16 setup ${circomId}.r1cs ${circomId}.ptau ${circomId}.pk`
    );

    await execShellCommand(
      `node ${circomId}_js/generate_witness.js ${circomId}_js/${circomId}.wasm ${circomId}.input.json ${circomId}.wtns`
    );

    await execShellCommand(
      `snarkjs groth16 prove ${circomId}.pk ${circomId}.wtns ${circomId}.pf.json ${circomId}.inst.json`
    );

    await unlink(`${circomId}.circom`);
    await unlink(`${circomId}.input.json`);
    await unlink(`${circomId}.pk`);
    await unlink(`${circomId}.ptau`);
    await unlink(`${circomId}.r1cs`);
    await unlink(`${circomId}.inst.json`);
    await unlink(`${circomId}.wtns`);
    await rmdir(`${circomId}_js`, { recursive: true });

    const response: GenerateProofResponseInterface = {
      valid: true,
      proof: JSON.parse(
        Buffer.from(await readFile(`${circomId}.pf.json`)).toString()
      ),
    };
    await unlink(`${circomId}.pf.json`);

    return response;
  } catch (error) {
    console.warn(error);
    return {
      valid: false,
    };
  }
};

export { generateProofGreaterEqualX };
