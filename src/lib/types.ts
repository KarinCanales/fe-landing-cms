export type ImageValue =
  | string
  | {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };

export type ContactInfo = {
  whatsapp?: string;
};
