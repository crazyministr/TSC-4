import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, beginCell, toNano } from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import fs from 'fs'

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create({

        });
        blockchain.verbosity = {
            blockchainLogs: true,
            vmLogs: 'vm_logs_full',
            debugLogs: true,
            print: false,
        }

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // function getFibSeq(n: bigint, k: bigint) {
        //     let n1 = 0n, n2 = 1n, nextTerm;


        //     let arr = []
        //     for (let i = 0; i < n + k; i++) {
        //         if (i >= n) arr.push(n1)
        //         nextTerm = n1 + n2;
        //         n1 = n2;
        //         n2 = nextTerm;
        //     }

        //     return arr
        // }
        function getFibSeq(n: bigint, k: bigint): string[] {
            const fibonacci = [0n, 1n];
            for (let i = 2; i <= n + k; i++) {
                fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
            }
            return fibonacci.slice(Number(n), Number(n + k)).map(String);
        }


            try {
            const res = await task5.getfibonacci_sequence(30n, 50n);
            console.log(res.stack);
            fs.writeFileSync('vmlogs.log', res.logs as string)
            if (res) {
                return
            }
            } catch( e :any ) {
            console.log('e', e)
            fs.writeFileSync('vmlogs.log', e?.blockchainLogs as string || '')
            throw e
        }
        // const res = await task5.getfibonacci_sequence(369n, 2n)
        // console.log('res', res.stack.readTuple())
        let totalGas = 0n
        for (let j = 30n; j <= 60n; j++) {
            for (let k = 100n; k <= 250n && j + k <= 371n; k += j + k > 360n ? 1n : 3n) {
                if (j + k > 371) {
                    continue
                }
                console.log('fib', j, k)
                try {
                    const res = await task5.getfibonacci_sequence(j, k)
                    console.log('res', res)
                    fs.writeFileSync('vmlogs.log', res.logs as string)

                    totalGas += res?.gasUsed || 0n
                    // const result = res.stack.readTuple()
                    // // console.log('res', res)

                    // const fib = getFibSeq(j, k)

                    // console.log('result', result)

                    // expect(BigInt(result.remaining)).toEqual(k)
                    // for (let i = 0; i < fib.length; i++) {
                    //     expect(fib[i].toString()).toEqual(result.readBigNumber().toString())
                    // }
                } catch (e: any) {
                    fs.writeFileSync('vmlogs.log', e?.blockchainLogs as string || '')
                    throw e
                }
                // for (const x of fib) {
                //     expect(result.readBigNumber()).toEqual(x)
                // }
            }
        }

        console.log('total gas', totalGas)
    });
});

