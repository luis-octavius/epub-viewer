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

    const keyListener = (e) => {
      if ((e.keyCode || e.which) == 37) {
        rendition.prev();
      }

      if ((e.keyCode || e.which) == 39) {
        rendition.next();
      }
    }


    const loadEbook = (book) => {
        book.ready.
        then(() => {
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
        if (iframe) {
          iframe.sandbox = 'allow-scripts allow-same-origin allow-popups';
        }
      });

      useRendition.on("selected", function(cfiRange, contents) {
        useRendition.annotations.highlight(cfiRange, {}, (e) => {
          console.log("highlight clicked", e.target);
          console.log(cfiRange);
        });
        contents.window.getSelection().removeAllRanges();
      })

      useRendition.themes.default({
        '::selection': {
          'background': 'rgba(255, 255, 0, 0.3)'
        },
        '.epubjs-hl': {
          'fill': 'yellow', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      });

      useRendition.on("selected", function(cfiRange) {
        book.getRange(cfiRange).then(function (range) {
          let text;
          let textNode;

          if (range) {
            text = range.toString();
            textNode = document.createTextNode(text);

            console.log(text);
            console.log(textNode);
          }
        });
      });

      useRendition.display();
      setRendition(useRendition);
    }).catch(error => {
        console.error("Error loading book: ", error);
      });
  };

    const prevPage = () => rendition?.prev();
    const nextPage = () => rendition?.next();

    return (
          <>
            {!isFileUpload ? (
                <form 
                method="post"
                className="flex flex-col items-center justify-center">
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
              <div
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div
                  id="area"
                  ref={viewerRef}
                  className="w-full h-5/6" 
                >
                  
                </div>
                <div
                    className="navigate"
                  >
                    <button 
                      onClick={prevPage}
                      onKeyDown={keyListener}
                      className="navigate-btns"
                    >
                      ⭠
                    </button>
                    <button 
                      onClick={nextPage}
                      onKeyDown={keyListener}
                      className="navigate-btns"  
                    >
                      ⭢
                    </button>
                  </div>
              </div>
            )}
          </>
    )
}