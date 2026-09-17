import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
const DB_FILE_PATH = process.env.DATABASE_URL || path.join(process.cwd(), 'transformai.sqlite');

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE_PATH);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (e) {
      console.warn('Could not read existing SQLite file, creating new database', e);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize schema
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      role TEXT DEFAULT 'innovator',
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      filename TEXT,
      file_type TEXT,
      file_size INTEGER,
      extracted_text TEXT,
      page_count INTEGER,
      word_count INTEGER,
      char_count INTEGER,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS transformations (
      id TEXT PRIMARY KEY,
      document_id TEXT,
      document_title TEXT,
      transformation_type TEXT,
      audience TEXT,
      tone TEXT,
      target_language TEXT,
      source_language TEXT DEFAULT 'English',
      length_setting TEXT,
      additional_instructions TEXT,
      source_content TEXT,
      generated_content TEXT,
      structured_json TEXT,
      quality_result_json TEXT,
      status TEXT DEFAULT 'completed',
      current_version INTEGER DEFAULT 1,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS transformation_versions (
      id TEXT PRIMARY KEY,
      transformation_id TEXT,
      version_number INTEGER,
      content TEXT,
      structured_json TEXT,
      quality_result_json TEXT,
      created_at TEXT,
      edit_note TEXT,
      FOREIGN KEY(transformation_id) REFERENCES transformations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      title TEXT,
      category TEXT,
      description TEXT,
      transformation_type TEXT,
      audience TEXT,
      tone TEXT,
      target_language TEXT,
      length_setting TEXT,
      sample_prompt TEXT,
      icon_name TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS usage_statistics (
      id TEXT PRIMARY KEY,
      event_type TEXT,
      transformation_type TEXT,
      target_language TEXT,
      word_count INTEGER,
      processing_time_ms INTEGER,
      created_at TEXT
    );
  `);

  saveDb();
  seedInitialData(dbInstance);

  return dbInstance;
}

export function saveDb(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite database to disk:', err);
  }
}

function seedInitialData(db: Database) {
  // Check if templates exist
  const res = db.exec('SELECT COUNT(*) as cnt FROM templates;');
  const count = res[0]?.values[0]?.[0] as number;

  if (!count || count === 0) {
    const initialTemplates = [
      {
        id: 'tpl-1',
        title: 'Chapter → Study Notes',
        category: 'Education',
        description: 'Transform textbook chapters and academic papers into structured study notes with key terms and summaries.',
        transformationType: 'Study Notes',
        audience: 'Student',
        tone: 'Academic',
        targetLanguage: 'English',
        lengthSetting: 'Detailed',
        samplePrompt: 'Extract key concepts, definitions, formulae, and conceptual hierarchies for exam preparation.',
        iconName: 'BookOpen'
      },
      {
        id: 'tpl-2',
        title: 'Document → 10 MCQs Quiz',
        category: 'Quiz',
        description: 'Generate 10 multiple-choice questions with answer keys and detailed explanations from any source document.',
        transformationType: 'MCQs',
        audience: 'Student',
        tone: 'Academic',
        targetLanguage: 'English',
        lengthSetting: 'Medium',
        samplePrompt: 'Create 10 comprehensive MCQs testing core knowledge, applications, and conceptual understanding.',
        iconName: 'HelpCircle'
      },
      {
        id: 'tpl-3',
        title: 'Document → 10-Slide PPT',
        category: 'Presentation',
        description: 'Generate high-impact presentation slide decks with title, key takeaways, and speaker notes.',
        transformationType: 'PPT',
        audience: 'Business Professional',
        tone: 'Professional',
        targetLanguage: 'English',
        lengthSetting: 'Medium',
        samplePrompt: 'Structure into 10 clean slides with punchy headlines, 3-4 bullet points, and presenter guidance.',
        iconName: 'Presentation'
      },
      {
        id: 'tpl-4',
        title: 'Report → Executive Summary',
        category: 'Business',
        description: 'Condense complex technical or financial reports into a 1-page executive summary for leadership.',
        transformationType: 'Executive Summary',
        audience: 'Business Professional',
        tone: 'Formal',
        targetLanguage: 'English',
        lengthSetting: 'Short',
        samplePrompt: 'Focus on strategic takeaways, business metrics, challenges, recommendations, and next steps.',
        iconName: 'Briefcase'
      },
      {
        id: 'tpl-5',
        title: 'Article → LinkedIn Post',
        category: 'Marketing',
        description: 'Turn lengthy blogs or papers into engaging, professional LinkedIn carousel summaries and thought-leadership posts.',
        transformationType: 'Social Media Post',
        audience: 'General Public',
        tone: 'Creative',
        targetLanguage: 'English',
        lengthSetting: 'Short',
        samplePrompt: 'Craft an engaging hook, 4-5 key insights with spacing, and a thought-provoking closing discussion prompt.',
        iconName: 'Share2'
      },
      {
        id: 'tpl-6',
        title: 'Research → Telugu Translation & Notes',
        category: 'Multilingual',
        description: 'Transform English technical research or curriculum materials into fluent, culturally authentic Telugu study notes.',
        transformationType: 'Study Notes',
        audience: 'Student',
        tone: 'Simple',
        targetLanguage: 'Telugu',
        lengthSetting: 'Detailed',
        samplePrompt: 'Translate and simplify core principles into natural Telugu with English technical terms preserved in parentheses.',
        iconName: 'Languages'
      }
    ];

    for (const tpl of initialTemplates) {
      db.run(
        `INSERT INTO templates (id, title, category, description, transformation_type, audience, tone, target_language, length_setting, sample_prompt, icon_name, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          tpl.id,
          tpl.title,
          tpl.category,
          tpl.description,
          tpl.transformationType,
          tpl.audience,
          tpl.tone,
          tpl.targetLanguage,
          tpl.lengthSetting,
          tpl.samplePrompt,
          tpl.iconName,
          new Date().toISOString()
        ]
      );
    }

    // Seed sample usage statistics
    const sampleEvents = [
      ['stat-1', 'transformation', 'Study Notes', 'English', 1250, 1420, new Date(Date.now() - 86400000 * 3).toISOString()],
      ['stat-2', 'transformation', 'Summary', 'Telugu', 980, 1150, new Date(Date.now() - 86400000 * 2).toISOString()],
      ['stat-3', 'transformation', 'PPT', 'English', 2300, 2100, new Date(Date.now() - 86400000 * 1).toISOString()],
      ['stat-4', 'transformation', 'MCQs', 'Hindi', 1540, 1800, new Date(Date.now() - 86400000 * 1).toISOString()],
      ['stat-5', 'transformation', 'Executive Summary', 'English', 3100, 1950, new Date().toISOString()],
      ['stat-6', 'transformation', 'Translation', 'Tamil', 1420, 1340, new Date().toISOString()]
    ];

    for (const ev of sampleEvents) {
      db.run(
        `INSERT INTO usage_statistics (id, event_type, transformation_type, target_language, word_count, processing_time_ms, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        ev
      );
    }

    saveDb();
  }
}
