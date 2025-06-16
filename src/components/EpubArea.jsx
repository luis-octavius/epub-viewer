import { useState, useRef, useEffect } from "react";
import ePub from "epubjs";

export default function EpubArea() {
    const [isFileUpload, setIsFileUpload] = useState(false);
    const [book, setBook] = useState(null);
    const viewerRef = useRef(null);

    const getFile = () => {
        const fileUpload = document.getElementById("file").files[0];
        setIsFileUpload(true);
        let actualBook = ePub(fileUpload);
        setBook(actualBook);
    }

    const loadEbook = () => {
        const rendition = book.renderTo("area", { method:'paginate', width: '100%', height: '100%'})
        viewerRef.current = rendition;
        rendition.display();
    }
    return (
        <div className="flex flex-col items-center justify-center epub bg-[var(--main-bg)]">
            {!isFileUpload ? (
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
                    onChange={()=> getFile()}
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
                    onLoad={loadEbook()}
                    className="w-full h-full flex flex-col justify-center items-center"   
                >
                <div
                    id="navigation"
                    className="z-10 w-full bg-amber-50 flex justify-center self-end text-lg"
                >
                    <button
                        id="prev"
                        className="navigate"
                        onClick={() => {
                            rendition.prev();
                        }}
                    >
                    ↼ 
                    </button>
                    <button
                        id="next"
                        className="navigate"
                        onClick={() => {
                            rendition.next();
                        }}
                    >
                    ⇀
                    </button>

                </div>
                </div>
            )}
        </div>
    )
}