interface CometTailDotProps {
  color: string;
  top: number;
  left: number;
  visible: boolean;
}

const CometTailDot: React.FC<CometTailDotProps> = ({ color, top, left, visible }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: "4px",
        height: "4px",
        backgroundColor: color,
        top,
        left,
        visibility: visible ? "visible" : "hidden",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
  );
};
