import { Server } from "partyserver";
import type { Connection, ConnectionContext } from "partyserver";
import type { OutgoingMessage, Position } from "./shared.js";

type ConnectionState = {
  position: Position;
};

export class Globe extends Server<any> {
  onConnect(conn: Connection<ConnectionState>, ctx: ConnectionContext) {
    conn.setState({ position: { x: 0, y: 0 } });
    
    // Gunakan optional chaining untuk keamanan
    const pos = conn.state?.position || { x: 0, y: 0 };

    this.broadcast(JSON.stringify({
      type: "user-joined",
      id: conn.id,
      position: pos
    }));
  }

  // FIX: Urutan parameter DITUKAR (sender dulu, baru message)
  onMessage(sender: Connection<ConnectionState>, message: string) {
    const data = JSON.parse(message) as OutgoingMessage;
    
    if (data.type === "position-update") {
      sender.setState({ position: data.position });
      
      this.broadcast(JSON.stringify({
        type: "position-update",
        id: sender.id,
        position: data.position
      }), [sender.id]);
    }
  }

  onClose(connection: Connection<ConnectionState>) {
    this.broadcast(JSON.stringify({
      type: "user-left",
      id: connection.id
    }));
  }
}