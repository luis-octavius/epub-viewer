import { useEffect, useRef } from "react";

export default function Modal({ openModal, closeModal, children }) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} onCancel={closeModal}  
    >
        {children}
        <div className="flex justify-center">
          <button 
            className="border-2 p-2 bg-[var(--sidebar-color)] rounded-lg"
          onClick={closeModal}>Close</button>
        </div>
    </dialog>
  );
}
