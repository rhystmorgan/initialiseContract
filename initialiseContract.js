const {Contract} = require('../models/contract');
const {Wallet} = require('../models/wallet');
const {User} = require('../models/user');
const cp = require('child_process');
const util = require('util');
const asyncExec = util.promisify(cp.exec)

async function initialiseContract(contract) {
  const magic = 2
  const lenderWallet = await Wallet.findById(contract.roles[0].wallet).populate();
  const lenderAddr = lenderWallet.walletAddress
  const lenderKey = lenderWallet.walletSeed
  const marlowe1 = contract.transactions[0].marlowe[0]
  const tx1Signed = contract.transactions[1].tx[0]

  const lenderInit = 'marlowe-cli run auto-execute \
  --marlowe-out-file ' + marlowe1 + ' \
  --change-address ' + lenderAddr + ' \
  --required-signer ' + lenderKey + ' \
  --testnet-magic ' + magic + ' \
  --out-file ' + tx1Signed + ' \
  --submit=600s'

  const txOut = asyncExec(`${lenderInit}`)
  .then((stdout, stderr) => {
    // console.log(stdout)
    stdout.pipe(process.stdout)
    // needs to return stdout - the first 6 char, - last char, + #1
  }).catch(error => {
    console.log('error : ', error)
  })

  // const marloweOut = txOut.substring(6, 64) + '#1'
  // console.log(marloweOut)
  // const updatedContract = Contract.findByIdAndUpdate(contract.id, {
  //   transactions: [{
  //     stateTx: marloweOut
  //   }],
  // }, {new: true})

}

module.exports = initialiseContract
