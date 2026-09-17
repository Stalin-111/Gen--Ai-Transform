/**
 * Smart document chunking and aggregation for large documents
 */

export interface TextChunk {
  index: number;
  totalChunks: number;
  content: string;
  wordCount: number;
}

const CHUNK_SIZE_WORDS = 8000; // Optimal chunk boundary (~32k tokens safe limit)
const CHUNK_OVERLAP_WORDS = 400; // Overlap boundary to prevent loss of context across splits

export function chunkTextIfNeeded(text: string): TextChunk[] {
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length <= CHUNK_SIZE_WORDS) {
    return [
      {
        index: 0,
        totalChunks: 1,
        content: text,
        wordCount: words.length,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let startIndex = 0;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + CHUNK_SIZE_WORDS, words.length);
    const chunkWords = words.slice(startIndex, endIndex);

    chunks.push({
      index: chunks.length,
      totalChunks: 0, // updated afterwards
      content: chunkWords.join(' '),
      wordCount: chunkWords.length,
    });

    if (endIndex >= words.length) {
      break;
    }

    startIndex = endIndex - CHUNK_OVERLAP_WORDS;
  }

  return chunks.map((c) => ({
    ...c,
    totalChunks: chunks.length,
  }));
}
