import { useEffect, useState } from "react";
import { Form } from "react-router";
import Modal from "./Modal";
import axios from 'axios';

export default function Annotations() {
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/notes')
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error('Houve um erro de conexão: ', error)
      })
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className="rounded-md bg-[var(--sidebar-color)] p-2 cursor-pointer"
        onClick={() => setModal(true)}
      >Adicionar Nota</button>
      <Modal
        openModal={modal}
        closeModal={() => setModal(false)}
      >
        <Form 
          className="flex flex-col"
          action="/notes" method="post">
          <label className="block" htmlFor="title">Title
          </label>
            <input name="title" placeholder="Note's name" type="text"></input>

          <label htmlFor="note">Note
          </label>
            <textarea name="note" rows="5" cols="30" type="text" placeholder="Note's text"></textarea>

          <button className="button" type="submit">Send</button>
        </Form>
      </Modal>
      <ul>
        {notes.map((note) => {
          <li>{note}</li>;
        })}
      </ul>
    </div>
  );
}
