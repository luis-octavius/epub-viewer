import { useState, useRef, useEffect } from "react";
import ePub from "epubjs";

export default function EpubArea() {
    const [isFileUpload, setIsFileUpload] = useState(false);
    const [book, setBook] = useState(null);

    const getFile = () => {
        const fileUpload = document.getElementById("file").files[0];
        setIsFileUpload(true);
        let book = ePub(fileUpload);
        console.log(book);
        setBook(book);
    }

    const loadEbook = () => {
        const rendition = book.renderTo("area", {width: "100%", height: 400});
        console.log("Book: ", book);
        console.log("Rendition: ", rendition)
        rendition.display();
    }

    return (
        <div className="flex flex-col items-center justify-center epub pl-5 bg-[var(--main-bg)] ">
            {!isFileUpload ? (
                <form 
                method="post"
                className="flex flex-col items-center">
                <label 
                    htmlFor="file"
                    className="button"
                >Choose Epub file to upload</label>
                <input 
                    name="file"
                    id="file"
                    type="file"
                    accept=".epub"
                    onChange={()=> getFile()}
                    />
                <button
                    className="w-15 bg-white rounded-md border-1 border-black p-1 m-1"
                    type="submit"
                >
                Send 
                </button>
                </form>
            ) : (
                <div
                    id="area"
                    onLoad={loadEbook()} 
                    className="w-full h-full"   
                >
                </div>
            )}
        </div>
    )
}