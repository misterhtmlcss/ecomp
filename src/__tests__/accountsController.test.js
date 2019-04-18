import { usersList, accounts } from '../data/user.json'
import AccountsController from './../components/accountsController'

describe('test class methods', () => {
  let allData = new AccountsController(usersList, accounts)

  it('test find user', () => {
    // find Stewie Griffin user
    const stewie = allData.findUser(777)
    expect(stewie).toHaveProperty("username", "Stewie Griffin")

    // find Lois user
    const lois = allData.findUser('456')
    expect(lois).not.toHaveProperty("username", "Stewie Griffin")
  })

  it('test find account', () => {
    // find account 1010
    const accountNum1 = "1010"
    const acc1 = allData.findAccount(accountNum1)
    expect(acc1).toHaveProperty("balance", 7425)

    // find account 0123
    const accountNum2 = "0123"
    const acc2 = allData.findAccount(accountNum2)
    expect(acc2).toHaveProperty("balance", 150)
    expect(acc2).not.toHaveProperty("balance", 6500)
  })

  it('test balance for one account', () => {
    //get Stewie's initial balance
    const stewie = allData.getBalance('1234')
    expect(stewie).toBe(100)
    expect(stewie).not.toBe(200)

    // get Glenn Quagmire inital balance
    const quagmire = allData.getBalance('2001')
    expect(quagmire).toBe(35000)
    expect(quagmire).not.toBe('35000')
    expect(quagmire).not.toBe(5000)

    //find Lois user
    const lois = allData.getBalance('0456')
    expect(lois).toBe(65000)
  })

  it('test group balance of all accounts', () => {
    //get Stewie's initial balance
    const stewie = allData.getAllAccountsBalance('777')
    expect(stewie).toBe(100)
    expect(stewie).not.toBe(200)

    // find Lois user
    const lois = allData.getAllAccountsBalance('456')
    expect(lois).toBe(65150)
  })

  it('test withdraw money', () => {
    const accountNum1 = "1010"
    allData.withdrawMoney(1, "CDN", accountNum1)
    const balance = allData.getBalance(accountNum1)
    expect(balance).toBe(7424)

    // Bug found here. Need to find why this is mutating another test suit.
    allData.depositMoney(1, "CDN", accountNum1)
  })

  it('should test currency check', () => {
    // Mexican to Canadian
    const monetaryVal1 = allData.currencyCheck(100, "MEX")
    // American to Canadian
    const monetaryVal2 = allData.currencyCheck(100, "USD")
    // Canadian to Canadian
    const monetaryVal3 = allData.currencyCheck(100, "CAD")

    expect(monetaryVal1).toBe(10)
    expect(monetaryVal2).toBe(200)
    expect(monetaryVal3).toBe(100)
  })

});


/*
Case 1:
  Customer:
    Stewie Griffin Customer ID: 777 Account Number: 1234
    Initial Balance for account number 1234: $100.00 CAD
    Stewie Griffin deposits $300.00 USD to account number 1234.

*/

describe('Case 1 test Stewie Griffin requirements', () => {
  let allData = new AccountsController(usersList, accounts)
  const accountNum = '1234'

  it('test for Stewie deposit', () => {
    // Validate balance

    const stewie = allData.getBalance(accountNum)
    expect(stewie).toBe(100)

    // Make a deposit
    const stewie2 = allData.depositMoney(300, 'USD', accountNum)
    expect(stewie2).toBe(700)
    expect(stewie2).not.toBe(300)
    expect(stewie2).not.toBe(600)

    // Validate balance after
    const stewieBalance = allData.getBalance(accountNum)
    expect(stewieBalance).toBe(700)
    console.log('Case 1: Account Number: 1234 Balance: $700.00 CAD: ', stewieBalance);
  })

});

/*
Case 2:
  Customer:
    Glenn Quagmire Customer ID: 504
    Account Number: 2001
    Initial balance for account number 2001: $35,000.00 CAD

    1. Withdraws $5,000.00 MXN from account number 2001.
    2. Withdraws $12,500.00 USD from account number 2001.
    3. Deposits $300.00 CAD to account number 2001.
*/
describe('Case 2 test Glenn Quagmire requirements', () => {

  let allData = new AccountsController(usersList, accounts)

  it('Case 2 test Glenn Quagmire requirements', () => {
    const accountNumQuagmire = '2001'
    console.error = jest.fn();

    let quagmire = allData.getBalance(accountNumQuagmire)
    expect(quagmire).toBe(35000)

    allData.withdrawMoney(5000, 'MEX', accountNumQuagmire)
    quagmire = allData.getBalance(accountNumQuagmire)
    expect(quagmire).toBe(34500)

    allData.withdrawMoney(12500, 'USD', accountNumQuagmire)
    quagmire = allData.getBalance(accountNumQuagmire)
    expect(quagmire).toBe(9500)

    /*
    Interferes with other tests: Needs further research
    allData.withdrawMoney(12500, 'USD', accountNumQuagmire)
    expect(console.error).toHaveBeenCalledTimes(1);

    allData.withdrawMoney(12500, 'USD', accountNumQuagmire)
    expect(console.error).toHaveBeenCalledTimes(2);
    */
  })

  it('testing quagmire', () => {
    const accountNumQuagmire = '2001'
    expect(allData.getBalance(accountNumQuagmire)).toBe(9500)
    allData.depositMoney(300, 'CAD', accountNumQuagmire)
    expect(allData.getBalance(accountNumQuagmire)).not.toBe(9500)
    expect(allData.getBalance(accountNumQuagmire)).toBe(9800)

    console.log('Account Number: 2001 Balance: $9,800 CAD: ', allData.getBalance(accountNumQuagmire));
  })

});




/*
Case 3:
  Customer:
    Joe Swanson
      Customer ID: 002
      Account Number: 1010
      Initial balance for account number 1010: $7,425.00 CAD

    Joe Swanson
      Customer ID: 002
      Account Number: 5500
      Initial balance for account number 5500: $15,000.00 CAD

    Joe Swanson
      Customer ID: 002
      withdraws $5,000.00 CAD from account number 5500.
      transfers $7,300.00 CAD from account number 1010 to account number 5500.
      deposits $13,726.00 MXN to account number 1010.

*/

describe('Case 3: test Joe Swanson requirements', () => {
  let allData = new AccountsController(usersList, accounts)

  const accountNumjoeSwanson1 = '1010'
  const accountNumjoeSwanson2 = '5500'
  // Account 1010
  let joeSwanson1 = allData.getBalance(accountNumjoeSwanson1)
  // Account 5500
  let joeSwanson2 = allData.getBalance(accountNumjoeSwanson2)


  it('testing balance of Joe Swanson', () => {
    expect(joeSwanson1).toBe(7425)
    expect(joeSwanson1).not.toBe(9500)

    expect(joeSwanson2).toBe(15000)
    expect(joeSwanson2).not.toBe(9500)
  })

  it('testing first amount withdrawn Joe Swanson', () => {
    //withdraws $5,000.00 CAD from account number 5500.
    expect(joeSwanson1).toBe(7425)
    expect(joeSwanson2).toBe(15000)

    joeSwanson2 = allData.withdrawMoney(5000, 'CAD', accountNumjoeSwanson2)

    expect(joeSwanson2).toBe(10000)
  })

  it('test amount transferred from account 1010 to 5500', () => {
    // Account 1010
    expect(joeSwanson1).toBe(7425)
    // Account 5500
    expect(joeSwanson2).toBe(10000)

    // Transfer 7300 CAD from Account 1010 to Account 5500
    allData.transferMoney(7300, 'CAD', '1010', '5500')
    joeSwanson1 = allData.getBalance(accountNumjoeSwanson1)
    joeSwanson2 = allData.getBalance(accountNumjoeSwanson2)
    expect(joeSwanson1).toBe(125)
    expect(joeSwanson2).toBe(17300)

  })

  it('deposits $13,726.00 MXN to account number 1010.', () => {
    joeSwanson1 = allData.getBalance(accountNumjoeSwanson1)
    expect(joeSwanson1).toBe(125)

    allData.depositMoney(13726, 'MEX', accountNumjoeSwanson1)
    joeSwanson1 = allData.getBalance(accountNumjoeSwanson1)
    expect(joeSwanson1).toBe(1497.6)

    console.log(`
      Account Number: 1010 Balance: $1,497.60 CAD ${allData.getBalance(accountNumjoeSwanson1)}
      Account Number: 5500 Balance: $17,300.00 CAD ${allData.getBalance(accountNumjoeSwanson2)}
    `);
  })

});

/*
Case 4:
Customer:
Peter Griffin Customer ID: 123
Account Number: 0123
Initial balance for account number 0123: $150.00 CAD

Customer:
Lois Griffin Customer ID: 456
Account Number: 0456
Initial balance for account number 0456: $65,000.00 CAD

Peter Griffin withdraws $70.00 USD from account number 0123.
Lois Griffin deposits $23,789.00 USD to account number 0456.
Lois Griffin transfers $23.75 CAD from account number 0456 to Peter Griffin (account number 0123).
*/

describe('Case 4: testing Peter Griffin and Lois', () => {
  let allData = new AccountsController(usersList, accounts)

  const accountNumPeterLois = '0123'
  const accountNumLois = '0456'

  it('check initial balances for Peter/Lois and Lois account', () => {
    expect(allData.getBalance(accountNumPeterLois)).toBe(150)

    expect(allData.getBalance(accountNumLois)).toBe(65000)
  })

  it('test Peters withdrawal', ()=>{
    expect(allData.getBalance(accountNumPeterLois)).toBe(150)
    allData.withdrawMoney(70, 'USD', accountNumPeterLois)
    expect(allData.getBalance(accountNumPeterLois)).toBe(10)
  })

  it('Lois Griffin deposits $23,789.00 USD to account number 0456', () => {
    expect(allData.depositMoney(23789, 'USD', accountNumLois)).toBe(112578)
  })

  it('Lois Griffin transfers $23.75 CAD from account number 0456 to Peter Griffin (account number 0123).', () => {
    allData.transferMoney(23.75, 'CAD', accountNumLois, accountNumPeterLois)
    console.log(`
    Account Number: 0123 Balance: $33.75 CAD ${allData.getBalance(accountNumPeterLois)}
    Account Number: 0456 Balance: $112,554.25 CAD  ${allData.getBalance(accountNumLois)}
    `);
  })





})

/*
Case 5:
Customer:
Joe Swanson Customer ID: 002
Account Number: 1010
Initial balance for account number 1010: $7,425.00 CAD
*/

describe('Case 5: testing Joe Swanson', () => {
  let allData = new AccountsController(usersList, accounts)

  const accountNumjoeSwanson1 = '1010'
  // Account 1010
  let joeSwanson1 = allData.getBalance(accountNumjoeSwanson1)

  it('testing balance of Joe Swanson', () => {
    expect(joeSwanson1).toBe(7425)
    expect(joeSwanson1).not.toBe(9500)
  })

  console.log(`
  Account Number: 1010 Balance: $7,425.00 CAD ${allData.getBalance('1010')}
  `);


})
