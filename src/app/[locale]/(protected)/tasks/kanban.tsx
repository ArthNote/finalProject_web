import { TBoard, TCard, TColumn } from "./data";
import { Board } from "./board";

function getInitialData(): TBoard {
  // Doing this so we get consistent ids on server and client
  const getCards = (() => {
    let count: number = 0;

    return function getCards({ amount }: { amount: number }): TCard[] {
      return Array.from({ length: amount }, (): TCard => {
        const id = count++;
        return {
          id: `card:${id}`,
          description: `Card ${id}`,
        };
      });
    };
  })();

  const columns: TColumn[] = [
    { id: "column:a", title: "Column A", cards: getCards({ amount: 10 }) },
    { id: "column:b", title: "Column B", cards: getCards({ amount: 4 }) },
    { id: "column:c", title: "Column C", cards: getCards({ amount: 30 }) },
    { id: "column:d", title: "Column D", cards: getCards({ amount: 17 }) },
  ];

  return {
    columns,
  };
}

export default function Page() {
  return <Board initial={getInitialData()} />;
}
