type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | {
      [key: string]: JsonLdValue;
    };

type JsonLdProps = {
  data: JsonLdValue;
};

function serializeJsonLd(data: JsonLdValue): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  );
}
