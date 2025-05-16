import { Table } from '../types';

export const isTableFullyPaid = (table: Table): boolean => {
  return table.people.length > 0 && table.people.every((person) => person.paid);
};

export const calculateTableTotal = (table: Table): number => {
  return table.people.reduce((total, person) => total + person.bill, 0);
};

export const generateRandomAvatar = (): string => {
  return `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70 + 1)}`;
};

export const resetTable = (table: Table): Table => ({
  ...table,
  enabled: false,
  name: "",
  number: "",
  people: [],
  products: [],
});

export const markAllAsPaid = (table: Table): Table => ({
  ...table,
  people: table.people.map(person => ({ ...person, paid: true }))
});

export const getNonPaidPeopleIndices = (table: Table): number[] => {
  return table.people
    .map((person, index) => ({ person, index }))
    .filter(item => !item.person.paid)
    .map(item => item.index);
};