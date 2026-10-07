import { useNavigate } from "react-router-dom";

const ScrollLink = ({ target, children, className = "", onClick }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();

    const element = document.getElementById(target);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/");
    }

    onClick?.();
  };

  return (
    <a
      href={`#${target}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
};

export default ScrollLink;