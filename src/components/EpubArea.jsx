import { useState, useRef, useEffect } from "react";
import ePub from "epubjs";

export default function EpubArea() {
    const [isFileUpload, setIsFileUpload] = useState(false);
    const [rendition, setRendition] = useState(null);
    const [book, setBook] = useState(null);
    const viewerRef = useRef(null);

    useEffect(() => {
      if (book) { 
        loadEbook(book);
      }
    }, [book])

    const getFile = () => {
        const fileUpload = document.getElementById("file").files[0];
        const url = URL.createObjectURL(fileUpload);
        setIsFileUpload(true);
        const newBook = ePub(url, {
          openAs: 'epub',
          requestCredentials: 'include'
        });
        setBook(newBook);
    }

    const loadEbook = (book) => {
        book.ready.then(() => {
        const useRendition = book.renderTo("area", {
        width: '100%',
        height: '100%',
        spread: 'none',
        iframeSandboxOpts: [
          'allow-scripts',
          'allow-same-origin',
          'allow-popups'
        ]
      });

      useRendition.on('displayed', () => {
        const iframe = document.querySelector('iframe');
        console.log(iframe)
        if (iframe) {
          iframe.sandbox = 'allow-scripts allow-same-origin allow-popups';
          iframe.addEventListener('load', () => {
            useRendition.display();
          });
        }
      });

      useRendition.display();
      setRendition(useRendition);
    });
  };

    const prevPage = () => {
      console.log(rendition)
      rendition?.previousPage;
    }
    const nextPage = () => rendition?.nextPage;

    return (
      <div className="flex flex-col items-center justify-center epub bg-[var(--main-bg)] ">
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
                </form>
            ) : (
              <>
                <div
                  id="area"
                  ref={viewerRef}
                  className="w-full h-full" 
                >
                  
                </div>
                <div
                    className="navigate"
                  >
                    <button 
                      onClick={prevPage}
                      className="navigate-btns"
                    >
                      ⭠
                    </button>
                    <button 
                      onClick={nextPage}
                      className="navigate-btns"  
                    >
                      ⭢
                    </button>
                  </div>
              </>
            )}
        </div>
    )
}