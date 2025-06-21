import { useState } from "react";
import Modal from "./Modal";

export default function Annotations() {
  const [notes, setNotes] = useState(["Teste", "Segundo Teste"]);

  const createNote = () => {};

  return (
    <div>
      <button onClick={createNote}>Adicionar Nota</button>
      <ul>
        {notes.map((note) => {
          <li>{note}</li>;
        })}
      </ul>
    </div>
  );
}
