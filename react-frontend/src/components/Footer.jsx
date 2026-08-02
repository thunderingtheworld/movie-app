import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/about">About</Link>
      </div>
    </footer>
  );
}