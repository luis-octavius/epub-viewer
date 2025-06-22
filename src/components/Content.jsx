import { useEffect, useState } from 'react';

export default function Content() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://openlibrary.org/search.json?title=laws&lang=pt&author=plato', {
      mode: "cors",
    })
    .then((response) => { 
      response.json();
      console.log(response)
    })
    .catch((error) => console.error(error));
  }, [])

  return (
    <div className="justify-self-center m-auto">

    </div>
  );
}
