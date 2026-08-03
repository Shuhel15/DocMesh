export function chunkText(
  text: string,
  //chunks size in characters
  chunkSize = 900,
  //overlap size in characters
  overlap = 100,
): string[] {
  if (!text.trim()) {
    return [];
  }
  //store the chunks in an array
  const chunks: string[] = [];
  let start = 0;

  //loop through the text and create chunks
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if(end>=text.length) {
      break;
    }
    start = end - overlap;
  }
  return chunks;
}
