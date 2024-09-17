export function calculateTransaction(transaction: any | string, type: string) {
  const transactions = [...transaction];

  if (type === 'balance') {
    return transactions.reduce((acc, curr) => curr?.type === 'income' ? acc + curr?.amount : acc - curr.amount, 0);
  }

  if (type === 'expense' || type === 'income') {
    return transactions.reduce(
      (acc, curr) => (curr.type === type ? acc + curr?.amount : acc),
      0
    );
  }
}
