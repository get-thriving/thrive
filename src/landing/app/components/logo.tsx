import logo from "@assets/jupiter.png";

/** The Thrive logo: the T in its rounded square, as the apps show it. */
export function Logo(props: { size: number }) {
  return (
    <img
      src={logo}
      width={props.size}
      height={props.size}
      alt=""
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
