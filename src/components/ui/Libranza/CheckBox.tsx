interface Props {
  on: boolean;
}

export function CheckBox({ on }: Props) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        border: "1px solid #000",
        verticalAlign: "middle",
        background: on ? "#000" : "transparent",
        marginRight: 3,
      }}
    />
  );
}