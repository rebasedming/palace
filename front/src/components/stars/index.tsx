import "./index.css";

const Star = ({ left, top, size, animationDuration }) => {
  const style = {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${animationDuration}s`,
  };

  return <div className="star" style={style}></div>;
};

const Background = () => {
  const numberOfStars = 50; // Adjust as needed

  const randomize = (factor) => Math.random() * factor;

  return (
    <div>
      {Array.from({ length: numberOfStars }).map((_, index) => (
        <Star
          key={index}
          left={randomize(100)} // Random position from 0% to 100%
          top={randomize(100)}
          size={randomize(30)} // Random size
          animationDuration={randomize(5) + 1} // Random duration from 1s to 6s
        />
      ))}
    </div>
  );
};

export default Background;
