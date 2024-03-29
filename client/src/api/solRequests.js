
import IDL from "./idl.json";
import { Connection, PublicKey, clusterApiUrl,LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Wallet } from '@project-serum/anchor';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU");

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(
    connection, window.solana, opts.preflightCommitment,
  );
  return provider;
  
}

const getProgram = async () => {
  return new Program(IDL, programID, getProvider());
};

const getMasterAddress = async () => {
  return (
    await PublicKey.findProgramAddress([Buffer.from('master')], programID)
  )[0];
};

const getPotAddress = async (id) => {
  return (
    await PublicKey.findProgramAddressSync(
      [Buffer.from('pot'), new BN(id).toArrayLike(Buffer, "le", 4)],
      programID
    )
  )[0];
};

const getHouseAddress = async () => {
  return new PublicKey('HHNCrJuKVtzRPuD3DVpcXkQA8dCuQ1U1KPntS9VKxFd7');
};

const getBetAddress = async (pot_address, id) => {
  return (
    await PublicKey.findProgramAddressSync(
      [
        Buffer.from('bet'),
        pot_address.toBuffer(),
        new BN(id).toArrayLike(Buffer, "le", 4),
      ],
      programID
    )
  )[0];
}

const confirmTx = async (txHash, connection) => {
  const blockhashInfo = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  });
};

export const initializePot = async (wallet) => {
  // Connect to the Solana network
  const connection = new Connection('https://api.devnet.solana.com');

  // Fetch the program account data
  const accountInfo = await connection.getAccountInfo(new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"));
  const program = await getProgram();

  const master_address = await getMasterAddress();

  const master = await program.account.master.fetch(
    master_address ?? (await getMasterAddress())
  );

  const pot_address = await getPotAddress(master.lastId + 1);

  const balance = await connection.getBalance(pot_address, 'confirmed');
  const pot_balance = balance / 10 ** 9; // Convert lamports to SOL


  const house_address = await getHouseAddress();

  const txHash = await program.methods
  .createPot(new BN(100000000))
    .accounts({
      pot: pot_address,
      master: master_address,
      house: wallet,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  await confirmTx(txHash, connection);
  const newBalance = await connection.getBalance(pot_address, 'confirmed');
  const pot_solBalance = newBalance / 10 ** 9; // Convert lamports to SOL
  return pot_solBalance;
}

export const placeBet = async (wallet) => {
    const connection = new Connection('https://api.devnet.solana.com');

    const program = await getProgram();
    const master_address = await getMasterAddress();
    const master = await program.account.master.fetch(
      master_address ?? (await getMasterAddress())
    );

    const pot_address = await getPotAddress(master.lastId);

    const pot = await program.account.pot.fetch(
      pot_address ?? (await getPotAddress(master.lastId))
    );
    const pot_balance = await connection.getBalance(pot_address, 'confirmed') / 10 ** 9; // Convert lamports to SOL

    const house_address = await getHouseAddress();

    const txHash = await program.methods
    .buyBet(pot.id)
      .accounts({
        pot: pot_address,
        bet: await getBetAddress(
          pot_address,
          pot.lastBetId + 1
        ),
        house: wallet,
      })
      .rpc();
    await confirmTx(txHash, connection);
    const balance = await connection.getBalance(pot_address, 'confirmed');
    const pot_solBalance = balance / 10 ** 9; // Convert lamports to SOL
    console.log(pot_solBalance);
    return pot_solBalance;

};

export const rewardWinner = async (wallet) => {
  const connection = new Connection('https://api.devnet.solana.com');

  const program = await getProgram();

  const master_address = await getMasterAddress();
  const master = await program.account.master.fetch(
    master_address ?? (await getMasterAddress())
  );

  const pot_address = await getPotAddress(master.lastId);

  const pot = await program.account.pot.fetch(
    pot_address ?? (await getPotAddress())
  );

  const bet_address = await getBetAddress(
    pot_address,
    pot.lastBetId
  )

  const bet = await program.account.bet.fetch(bet_address)

  const house_address = await getHouseAddress();

  const txHash = await program.methods
  .claimPot(pot.id, bet.id)
    .accounts({
      pot: pot_address,
      house: house_address,
    })
    .rpc();
  await confirmTx(txHash, connection);
  const balance = await connection.getBalance(pot_address, 'confirmed');
  const pot_solBalance = balance / 10 ** 9; // Convert lamports to SOL

  
  const playerBalance = await getSolBalance(wallet);

  return playerBalance;
};

export const getSolBalance = async (wallet) => {
  const connection = new Connection('https://api.devnet.solana.com');

  try {
    const publicKey = new PublicKey(wallet);
    const balance = await connection.getBalance(publicKey, 'confirmed');
    const solBalance = balance / 10 ** 9; // Convert lamports to SOL
    return solBalance;
  } catch (error) {
    console.error('Error:', error.message);
  }
}
