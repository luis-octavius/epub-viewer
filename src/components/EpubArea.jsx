import { useState, useRef, useEffect } from "react";
import ePub from "epubjs";

export default function EpubArea() {
    const [book, setBook] = useState(null);
    const [currentPage, setCurrentPage] = useState("");
    const viewerRef = useRef(null);
    const [metadata, setMetaData] = useState({ title: "", author: ""});

    const getFile = (file) => {
        if (!file) return;

        setIsFileUpload(true);
        const url = URL.createObjectURL(file);
        const newBook = ePub(url);
        console.log(newBook);
        setBook(newBook);
    };

    const loadEbook = () => {
        console.log("Is")
        console.log(book)
        book.loaded.metadata
        .then((meta) => {
            setMetaData({
                title: meta.title || "No Title",
                author: meta.creator || "Uknown Author",
            });
            console.log("Title: ", meta.author);
            console.log("Author : ", meta.author);
        });
        

        book.ready.then(() => {
            book.renderTo(viewerRef.current, { width: "100%", height: "100%"});
            console.log(book.renderTo(viewerRef.current))
        })
    }

    const nextPage = () => book?.nextPage();
    const prevPage = () => book?.prevPage();

    useEffect(() => {
        if (book) loadEbook();
    }, [book]);

    return (
        <div className="flex flex-col items-center justify-center epub bg-[var(--main-bg)]">
            {!book ? (
                <form 
                method="post"
                className="flex flex-col items-center">
                <label 
                    htmlFor="file"
                    className="button"
                >Choose EPUB file to upload</label>
                <input 
                    name="file"
                    id="file"
                    type="file"
                    accept=".epub"
                    onChange={(e) => getFile(e.target.files[0])}
                    />
                {/* <button
                    className="w-15 bg-white rounded-md border-1 border-black p-1 m-1"
                    type="submit"
                >
                Send 
                </button> */}
                </form>
            ) : (
                <div
                    id="area"
                    ref={viewerRef}
                    className="w-full h-full flex flex-col justify-end"   
                >
                <div
                    id="navigation"
                    className="z-10 w-full bg-amber-50 flex justify-center self-end text-lg"
                >
                    <button
                        id="prev"
                        className="navigate"
                        onClick={prevPage}
                    >
                    ↼ 
                    </button>
                    <button
                        id="next"
                        className="navigate"
                        onClick={nextPage}
                    >
                    ⇀
                    </button>

                </div>
                </div>
            )}
        </div>
    )
}