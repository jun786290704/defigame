import BigNumber from 'bignumber.js';
import { Web3JsCallOptions, Web3JsAbiCall, Web3JsSendOptions } from '../../abi-common';
import { Contract, Contracts } from './interfaces';

export type CryptoBladesAlias = NonNullable<Contracts['CryptoBlades']>;
export type NFTMarketAlias = NonNullable<Contracts['NFTMarket']>;

type CryptoBladesMethodsFunction = (cryptoBladesContract: CryptoBladesAlias['methods']) => Web3JsAbiCall<string>;

export async function getFeeInDkcFromUsd(
  cryptoBladesContract: CryptoBladesAlias,
  opts: Web3JsCallOptions,
  fn: CryptoBladesMethodsFunction
): Promise<string> {
  const feeInUsd = await fn(cryptoBladesContract.methods).call(opts);

  const feeInDkc = await cryptoBladesContract.methods
    .usdToDkc(feeInUsd)
    .call(opts);

  return feeInDkc;
}

type WithOptionalFrom<T extends { from: unknown }> = Omit<T, 'from'> & Partial<Pick<T, 'from'>>;

export async function approveFee(
  cryptoBladesContract: CryptoBladesAlias,
  dkcToken: Contracts['DkcToken'],
  from: NonNullable<Web3JsCallOptions['from']>,
  dkcRewardsAvailable: string,
  callOpts: WithOptionalFrom<Web3JsCallOptions>,
  approveOpts: WithOptionalFrom<Web3JsSendOptions>,
  fn: CryptoBladesMethodsFunction,
  { feeMultiplier }: { feeMultiplier?: string | number } = {}
) {
  const callOptsWithFrom: Web3JsCallOptions = { from, ...callOpts };
  const approveOptsWithFrom: Web3JsSendOptions = { from, ...approveOpts };

  let feeInDkc = new BigNumber(await getFeeInDkcFromUsd(cryptoBladesContract, callOptsWithFrom, fn));

  if(feeMultiplier !== undefined) {
    feeInDkc = feeInDkc.times(feeMultiplier);
  }

  try {
    feeInDkc = await cryptoBladesContract.methods
      .getUsdtNeededFromUserWallet(from, feeInDkc.toString())
      .call(callOptsWithFrom)
      .then(n => new BigNumber(n));

  }
  catch(err) {
    const paidByRewardPool = feeInDkc.lte(dkcRewardsAvailable);

    if(paidByRewardPool) {
      return null;
    }
  }

  const allowance = await dkcToken.methods
    .allowance(from, cryptoBladesContract.options.address)
    .call(callOptsWithFrom);

  if(feeInDkc.lte(allowance)) {
    return null;
  }

  return await dkcToken.methods
    .approve(cryptoBladesContract.options.address, feeInDkc.toString())
    .send(approveOptsWithFrom);
}

export async function waitUntilEvent(contract: Contract<unknown>, eventName: string, opts: Record<string, unknown>): Promise<Record<string, unknown>> {
  let subscriber: any;

  const data = await new Promise<Record<string, unknown>>((resolve, reject) => {
    subscriber = contract.events[eventName](opts, (err: Error | null, data: Record<string, unknown> | null) => {
      if(err) reject(err);
      else resolve(data!);
    });
  });

  subscriber.unsubscribe();

  return data;
}
