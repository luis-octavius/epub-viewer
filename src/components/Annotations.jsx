import { useEffect, useState } from "react";
import { Form } from "react-router";
import Modal from "./Modal";

export default function Annotations() {
  const [note, setNote] = useState({
    id: '',
    title: '',
    description: ''
  })
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    
  }, [notes]);

  const handleChange = (e) => {
    console.log(e.target.value)
    const title = e.target[0].value;
    const description = e.target[1].value;
    setNote({
      ...note, 
      title: title,
      description: description 
    })
    console.log(note)
  } 

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[1].value;

    setNotes([...notes,
      {
        ...note,
        id: Date.now()
      }
    ])    

    setNote({
      id: '',
      title: '',
      description: ''
    })
  }
  

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
          className="flex flex-col items-center text-xl"
          action="/notes" method="post"
          onSubmit={(e) => handleSubmit(e)}
          onChange={(e) => handleChange(e)}
          >
          <label className="block" htmlFor="title">Title
          </label>
            <input className="w-full" name="title" placeholder="Note's name" type="text"></input>

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
