import { useState, useRef, useEffect } from "react";
import ePub from "epubjs";
import { useLoaderData } from 'react-router';

export default function EpubArea() {
    const savedState = useLoaderData();
    const [isFileUpload, setIsFileUpload] = useState(false);
    const [rendition, setRendition] = useState(null);
    const [book, setBook] = useState(null);
    const viewerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(savedState?.theme || "");
    const [font, setFont] = useState(savedState?.font || "140%");

    useEffect(() => {
        if (!rendition) return;

        const savePosition = () => {
          rendition.currentLocation().then(loc => {
          localStorage.setItem('epubState', JSON.stringify({
            currentCfi: loc.start.cfi,
            font,
            theme: selectedValue,
        }));
      });
    };
        
    window.addEventListener('beforeunload', savePosition);
    return () => window.removeEventListener('beforeunload', savePosition);
    }, [font, selectedValue, rendition])

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
        const savedState = JSON.parse(localStorage.getItem('epubState')) || {};

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

      // Restaura a posição do ebook
      useRendition.display(savedState.currentCfi || undefined);

      // Restaurando o tema e a fonte
      if (savedState.theme) {
        useRendition.themes.select(savedState.theme);
        setSelectedValue(savedState.theme);
      }

      if (savedState.font) {
        useRendition.themes.fontSize(savedState.font);
        setFont(savedState.font);
      }

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

      useRendition.themes.register("dark", "themes.css");
      useRendition.themes.register("light", "themes.css");
      useRendition.themes.register("retro", "themes.css");

      useRendition.themes.fontSize(font);

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

  const handleSelect = (value) => {
    setSelectedValue(value);
    rendition.themes.select(value);
    setIsOpen(false);
  }

  const handleSize = (value) => {
    const parsedFont = parseInt(font);
    if (value == "-10" && parsedFont > 0) {
      rendition.themes.fontSize(`${parsedFont - 10}%`);
      setFont(`${parsedFont - 10}%`);
      console.log(`${parsedFont - 10}%`)
    } 
    if (value == "+10" && parsedFont < 200) {
      rendition.themes.fontSize(`${parsedFont + 10}%`);
      setFont(`${parsedFont + 10}%`)
      console.log(`${parsedFont + 10}%`);

    }
  }

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
                      onClick={() => handleSize("-10")}
                      className="navigate-btns"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleSize("+10")}
                      className="navigate-btns"
                    >
                      +
                    </button>
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
                    <div
                      className="flex flex-col border-2 z-10 border-black p-2 bg-[var(--sidebar-color)]"
                    >
                    <button
                      onClick={handleToggle}
                      className=""
                    >
                      {selectedValue || 'Theme'}
                    </button>
                    {isOpen && (
                      <ul>
                        <li onClick={() => handleSelect('dark')}>Dark</li>
                        <li onClick={() => handleSelect('light')}>Light</li>
                        <li onClick={() => handleSelect('retro')}>Retro</li>
                      </ul>
                    )}
                    </div>
                  </div>
              </div>
            )}
          </>
    )
}