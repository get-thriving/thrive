// What the WebAPI takes of a picture (ADR 0018). Past this it says no, so the
// browser says it first rather than sending what will be turned down.
export const MAX_PICTURE_BYTES = 4 * 1024 * 1024;

// Pictures up to this size are sent as they are. Phone cameras make photos
// bigger than the WebAPI takes, so anything above is scaled down first.
export const SEND_AS_IS_UP_TO_BYTES = 3 * 1024 * 1024;

// The WebAPI keeps a 256 px square, so this leaves plenty to crop from.
export const SCALED_LONG_SIDE_PIXELS = 1600;

export const ACCEPTED_PICTURE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function needsScalingDown(sizeInBytes: number): boolean {
  return sizeInBytes > SEND_AS_IS_UP_TO_BYTES;
}

/** The size with the long side brought down to `longSide`. Never scaled up. */
export function fitLongSide(
  width: number,
  height: number,
  longSide: number,
): { width: number; height: number } {
  const current = Math.max(width, height);
  if (current <= longSide) {
    return { width, height };
  }

  const ratio = longSide / current;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

// A PNG may be see-through, which a JPEG cannot be. Whatever else it was, a
// photo does well as a JPEG.
export function scaledPictureType(sourceType: string): string {
  return sourceType === "image/png" ? "image/png" : "image/jpeg";
}

function scaledPictureName(sourceName: string, type: string): string {
  const stem = sourceName.replace(/\.[^./\\]+$/, "") || "picture";
  return `${stem}.${type === "image/png" ? "png" : "jpg"}`;
}

/**
 * Gets a picture ready to be sent: as it is if it will do, and otherwise scaled
 * down in the browser, which also drops what the camera wrote into it.
 *
 * If the browser cannot read the picture (most cannot read HEIC) it is returned
 * as it is, and the WebAPI says what is wrong with it.
 */
export async function prepareAvatarPicture(file: File): Promise<File> {
  if (!needsScalingDown(file.size)) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    // Turned the way the camera meant it, unless told otherwise.
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const { width, height } = fitLongSide(
      bitmap.width,
      bitmap.height,
      SCALED_LONG_SIDE_PIXELS,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (context === null) {
      return file;
    }
    context.drawImage(bitmap, 0, 0, width, height);

    const type = scaledPictureType(file.type);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, 0.9),
    );
    if (blob === null) {
      return file;
    }
    return new File([blob], scaledPictureName(file.name, type), { type });
  } finally {
    bitmap.close();
  }
}
