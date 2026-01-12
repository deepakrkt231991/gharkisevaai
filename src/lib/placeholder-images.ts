import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  name?: string;
  specialty?: string;
  rating?: number;
  reviews?: number;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
