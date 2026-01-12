export type Position = {
  x: number;
  y: number;
};

export type OutgoingMessage =
  | { type: "user-joined"; id: string; position: Position }
  | { type: "position-update"; id?: string; position: Position }
  | { type: "user-left"; id: string };