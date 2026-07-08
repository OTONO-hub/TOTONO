type Props =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  className = "",
  ...props
}: Props) {
  return (
    <textarea
      className={`min-h-32 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-emerald-500 ${className}`}
      {...props}
    />
  );
}