type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  className = "",
  ...props
}: Props) {
  return (
    <input
      className={`w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-emerald-500 ${className}`}
      {...props}
    />
  );
}