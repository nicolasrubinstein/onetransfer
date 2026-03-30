interface IParticipant {
  name: string;
  balance: number;
}

interface ITransfer {
  source: IParticipant;
  target: IParticipant;
  amt: number;
}

const rounder = (n: number) => {
  return Math.round(n * 100) / 100;
};

const getTransactions = (participants: IParticipant[]) => {
  const toReturn: ITransfer[] = [];
  let total = 0;
  let peopleAmt = participants.length;

  const receivers: IParticipant[] = [];

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

const getStrings = (transfers: ITransfer[]) => {
  const toReturn: string[] = [];
  transfers.forEach((t) => {
    const stringAmt = t.amt.toFixed(2).toString();
    toReturn.push(`${t.source.name} le pasa ${stringAmt} a ${t.target.name}`);
  });

  return toReturn;
};

const trans = getTransactions([
  { name: "A", balance: 10 },
  { name: "B", balance: 0 },
  { name: "C", balance: 0 },
  { name: "D", balance: 7 },
  { name: "E", balance: 0 },
]);

console.log(getStrings(trans));
