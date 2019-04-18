// Takes the Accounts created with `account` and rolls them into an array
// Create 1 or more chequing accounts, including joint accounts.
// Return selected account balance
// Balances are tracked in Canadian currency.
// Deposits and withdraws can be made in Canadian dollars, US dollars or Mexican Pesos.
// Exchange rate is applied when depositing or withdrawing a foreign currency.
// Funds can be transferred between two different accounts.


// accountList: Array of accounts
// users: Array of user Objects

class AccountsController {
  constructor(users, accounts) {

    this.accounts = accounts
    this.users = users
  }

  // string accounts: [ { "cuid":...., ...}]
  findUser = (userId) => {
    const user = this.users.filter( user => {
      if(user.cuid === userId.toString()) {
        return user
      }
      return null
    })
    if(user.length === 0) return `user ${user.cuid} doesn't exist`
    return user[0]
  }

  // string accounts: [ { "accountId":...., ...}]
  // This function isn't working right.
  findAccount = (accountId) => {
    const account = this.accounts.filter( account => {
      if(account.accountId === accountId){
        return account
      }
      return false
    })
    return account[0]
  }
  // int, string, string
  withdrawMoney = (amount = 0, currency = 'CDN', accountId) => {
    const withdrawAmount = this.currencyCheck(amount, currency)
    const accountForWithdrawal = this.findAccount(accountId)

    if(accountForWithdrawal.balance > withdrawAmount){
      return accountForWithdrawal.balance -= withdrawAmount
    }
    console.error("You don't have enough money in your account")

  }

  // int, string, string
  depositMoney = (amount = 0, currency = 'CDN', accountId) => {
    const depositAmount = this.currencyCheck(amount, currency)
    const accountForDeposit = this.findAccount(accountId)
    return accountForDeposit.balance += depositAmount
  }

  transferMoney = (amount = 0, currency = 'CDN', accountId1, accountId2) => {
    this.withdrawMoney(amount, currency, accountId1)
    this.depositMoney(amount, currency, accountId2)
    return
  }

  // string
  getBalance = (id) => {
    // Generates an array with the account
    const accountArr = this.accounts.filter( account => {
      if(account.accountId === id) {
        return true
      }
      return false
    })
    const [{ balance }, ...rest] = accountArr
    return balance
  }

  // string
  getAllAccountsBalance = (id) => {
    const user = this.findUser(id)
    const { accountList, ...rest } = user
    const userAccountIds = accountList.map(account => account.accountId)

    const total =
        this.accounts
          .filter( account => {
            const matches =
              userAccountIds
                .filter( id => {
                  if(id === account.accountId) return account
                  return false
                })
              if( matches.length > 0) return account
              return false
          })
          .reduce( (acc, curr) =>  acc + curr.balance, 0)
    return total
  }

  // int, string
  currencyCheck = (amount, currency) => {
    switch(currency) {
      case "MEX":
        return amount / 10;
      case "USD":
        return amount * 2;
      default:
        return amount
    }
  }
}



export default AccountsController;
