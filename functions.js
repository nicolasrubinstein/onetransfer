"use strict";
const rounder = (n) => {
  return Math.round(n * 100) / 100;
};
const getTransactions = (participants) => {
  const toReturn = [];
  let total = 0;
  let peopleAmt = participants.length;
  const receivers = [];
  // calculo total
  participants.forEach((p) => {
    total += p.balance;
  });
  const amtDue = rounder(total / peopleAmt);
  // populo los negatives con los participantes que deben recibir y ajusto los balances
  participants.forEach((p) => {
    //p.balance = Math.floor(-1 * p.balance + amtDue);
    p.balance = rounder(-1 * p.balance + amtDue);
    if (p.balance < 0) {
      receivers.push(p);
    }
  });
  // recorro y ejecuto las transferencias
  let currRecIdx = 0;
  participants.forEach((p) => {
    if (p.balance > 0) {
      let bal = p.balance;
      while (bal > 0) {
        let toTransfer = 0;
        let updateIdx = 0;
        if (bal + receivers[currRecIdx].balance >= 0) {
          // hay que pasar de receptor, ya va a cancelar
          toTransfer = rounder(-1 * receivers[currRecIdx].balance);
          bal = rounder(bal + receivers[currRecIdx].balance);
          updateIdx = 1;
        } else {
          // se le sigue debiendo al receptor actual
          toTransfer = bal;
          receivers[currRecIdx].balance = rounder(
            receivers[currRecIdx].balance + toTransfer,
          );
          bal = 0;
        }
        toReturn.push({
          source: p,
          target: receivers[currRecIdx],
          amt: toTransfer,
        });
        currRecIdx += updateIdx;
      }
    }
  });
  return toReturn;
};
const getStrings = (transfers) => {
  const toReturn = [];
  transfers.forEach((t) => {
    const stringAmt = t.amt.toFixed(2).toString();
    toReturn.push(`${t.source.name} le pasa ${stringAmt} a ${t.target.name}`);
  });
  return toReturn;
};
