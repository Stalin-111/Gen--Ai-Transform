import { Router } from 'express';
import { getDb, saveDb } from '../database/db.js';

export const historyRouter = Router();

// GET /api/transformations
historyRouter.get('/', async (req, res) => {
  try {
    const { search, type, language, sort } = req.query;

    const db = await getDb();
    let query = 'SELECT * FROM transformations WHERE 1=1';
    const params: any[] = [];

    if (search && typeof search === 'string') {
      query += ' AND (document_title LIKE ? OR generated_content LIKE ? OR source_content LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (type && typeof type === 'string' && type !== 'All') {
      query += ' AND transformation_type = ?';
      params.push(type);
    }

    if (language && typeof language === 'string' && language !== 'All') {
      query += ' AND target_language = ?';
      params.push(language);
    }

    if (sort === 'oldest') {
      query += ' ORDER BY created_at ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    query += ' LIMIT 100;';

    const result = db.exec(query, params);
    if (!result || result.length === 0) {
      return res.json({ transformations: [] });
    }

    const cols = result[0].columns;
    const transformations = result[0].values.map((row) => {
      const obj: any = {};
      cols.forEach((col, idx) => {
        obj[col] = row[idx];
      });

      return {
        id: obj.id,
        documentId: obj.document_id,
        documentTitle: obj.document_title,
        transformationType: obj.transformation_type,
        audience: obj.audience,
        tone: obj.tone,
        targetLanguage: obj.target_language,
        sourceLanguage: obj.source_language,
        lengthSetting: obj.length_setting,
        additionalInstructions: obj.additional_instructions,
        sourceContent: obj.source_content,
        generatedContent: obj.generated_content,
        structuredJson: obj.structured_json ? JSON.parse(obj.structured_json) : null,
        qualityResult: obj.quality_result_json ? JSON.parse(obj.quality_result_json) : null,
        status: obj.status,
        currentVersion: obj.current_version,
        createdAt: obj.created_at,
        updatedAt: obj.updated_at,
      };
    });

    return res.json({ transformations });
  } catch (err: any) {
    console.error('Failed to query transformations:', err);
    return res.status(500).json({ error: 'Failed to retrieve transformation history' });
  }
});

// GET /api/transformations/:id
historyRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    const tRes = db.exec('SELECT * FROM transformations WHERE id = ?;', [id]);
    if (!tRes || tRes.length === 0 || tRes[0].values.length === 0) {
      return res.status(404).json({ error: 'Transformation not found' });
    }

    const row = tRes[0].values[0];
    const cols = tRes[0].columns;
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = row[idx];
    });

    // Query versions
    const vRes = db.exec(
      'SELECT * FROM transformation_versions WHERE transformation_id = ? ORDER BY version_number ASC;',
      [id]
    );
    const versions = vRes && vRes.length > 0
      ? vRes[0].values.map((vRow) => {
          const vObj: any = {};
          vRes[0].columns.forEach((c, idx) => {
            vObj[c] = vRow[idx];
          });
          return {
            id: vObj.id,
            transformationId: vObj.transformation_id,
            versionNumber: vObj.version_number,
            content: vObj.content,
            structuredJson: vObj.structured_json ? JSON.parse(vObj.structured_json) : null,
            qualityResult: vObj.quality_result_json ? JSON.parse(vObj.quality_result_json) : null,
            createdAt: vObj.created_at,
            editNote: vObj.edit_note,
          };
        })
      : [];

    return res.json({
      transformation: {
        id: obj.id,
        documentId: obj.document_id,
        documentTitle: obj.document_title,
        transformationType: obj.transformation_type,
        audience: obj.audience,
        tone: obj.tone,
        targetLanguage: obj.target_language,
        sourceLanguage: obj.source_language,
        lengthSetting: obj.length_setting,
        additionalInstructions: obj.additional_instructions,
        sourceContent: obj.source_content,
        generatedContent: obj.generated_content,
        structuredJson: obj.structured_json ? JSON.parse(obj.structured_json) : null,
        qualityResult: obj.quality_result_json ? JSON.parse(obj.quality_result_json) : null,
        status: obj.status,
        currentVersion: obj.current_version,
        createdAt: obj.created_at,
        updatedAt: obj.updated_at,
        versions,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error fetching transformation details' });
  }
});

// PUT /api/transformations/:id (edit and save new version)
historyRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { editedContent, structuredJson, editNote } = req.body;
    const db = await getDb();

    // Fetch current version count
    const tRes = db.exec('SELECT current_version FROM transformations WHERE id = ?;', [id]);
    if (!tRes || tRes.length === 0 || tRes[0].values.length === 0) {
      return res.status(404).json({ error: 'Transformation not found' });
    }

    const currentVer = (tRes[0].values[0][0] as number) || 1;
    const newVer = currentVer + 1;
    const now = new Date().toISOString();

    // Update main transformation
    db.run(
      `UPDATE transformations
       SET generated_content = ?, structured_json = ?, current_version = ?, updated_at = ?
       WHERE id = ?;`,
      [
        editedContent,
        structuredJson ? JSON.stringify(structuredJson) : null,
        newVer,
        now,
        id,
      ]
    );

    // Insert new version record
    const versionId = 'ver_' + Date.now() + '_' + newVer;
    db.run(
      `INSERT INTO transformation_versions (
        id, transformation_id, version_number, content, structured_json, created_at, edit_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        versionId,
        id,
        newVer,
        editedContent,
        structuredJson ? JSON.stringify(structuredJson) : null,
        now,
        editNote || `User Edit (Version ${newVer})`,
      ]
    );

    saveDb();

    return res.json({
      success: true,
      currentVersion: newVer,
      updatedAt: now,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update transformation' });
  }
});

// DELETE /api/transformations/:id
historyRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    db.run('DELETE FROM transformation_versions WHERE transformation_id = ?;', [id]);
    db.run('DELETE FROM transformations WHERE id = ?;', [id]);
    saveDb();

    return res.json({ success: true, message: 'Transformation removed successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete transformation' });
  }
});
