import { generateCircomGreaterEqualThanX } from './circomGenerator';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, unlink, rmdir } from 'fs/promises';
import { execShellCommand } from './execShellCommand';

const verifyProofGreaterEqualX = async (
  x: number,
  proof: object
): Promise<boolean> => {
  try {
    const circomId = uuidv4();

    await writeFile(`${circomId}.circom`, generateCircomGreaterEqualThanX());

    await writeFile(`${circomId}.pf.json`, `${JSON.stringify(proof)}`);

    await writeFile(`${circomId}.inst.json`, `["${x}", "1" ]`);

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
      `snarkjs zkey export verificationkey ${circomId}.pk ${circomId}.vk`
    );

    await execShellCommand(
      `snarkjs groth16 verify ${circomId}.vk ${circomId}.inst.json ${circomId}.pf.json`
    );

    await unlink(`${circomId}.circom`);
    await unlink(`${circomId}.pk`);
    await unlink(`${circomId}.ptau`);
    await unlink(`${circomId}.r1cs`);
    await unlink(`${circomId}.inst.json`);
    await rmdir(`${circomId}_js`, { recursive: true });
    await unlink(`${circomId}.pf.json`);
    await unlink(`${circomId}.vk`);

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

export { verifyProofGreaterEqualX };
