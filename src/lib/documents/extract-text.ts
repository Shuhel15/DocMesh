import mammoth from "mammoth";
import WordExtractor from "word-extractor";
import { extractText as extractPdfText, getDocumentProxy } from "unpdf";

async function extractPdf(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));

  const result = await extractPdfText(pdf, {
    mergePages: true,
  });

  return result.text;
}

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  switch (extension) {
    case "txt": {
      return buffer.toString("utf-8");
    }

    case "pdf": {
      return extractPdf(buffer);
    }

    case "docx": {
      const result = await mammoth.extractRawText({
        buffer,
      });

      return result.value;
    }

    case "doc": {
      const extractor = new WordExtractor();

      const document = await extractor.extract(buffer);

      return document.getBody();
    }

    default:
      throw new Error(
        "Unsupported file type. Please upload PDF, TXT, DOC, or DOCX."
      );
  }
}