import { Link } from 'react-router';

export default function Navbar() {
  return (
    <div className="navbar flex flex-col bg-[var(--sidebar-color)] shadow-[4px_0_6px_-1px_rgba(0,0,0,0.5)]">
      <Link to="/content" className="h3-link">Home</Link> 
      <Link to="/epub" className="h3-link">Epub</Link>
      <Link to="/annotations" className="h3-link">Annotations</Link>     
    </div>
  )
}
