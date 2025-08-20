import pool from '../database.js';

export const getFabrics = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fabrics WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ fabrics: result.rows });
  } catch (error) {
    console.error('Get fabrics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFabric = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM fabrics WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fabric not found' });
    }

    res.json({ fabric: result.rows[0] });
  } catch (error) {
    console.error('Get fabric error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFabric = async (req, res) => {
  try {
    const {
      name,
      type,
      fiber_content,
      weight,
      color,
      pattern,
      width,
      total_yards,
      cost_per_yard,
      total_cost,
      source,
      notes,
      is_pinned
    } = req.body;

    if (!name || !total_yards) {
      return res.status(400).json({ message: 'Name and total yards are required' });
    }

    const result = await pool.query(
      `INSERT INTO fabrics (
        id, user_id, name, type, fiber_content, weight, color, pattern, 
        width, total_yards, cost_per_yard, total_cost, source, notes, is_pinned
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        `fabric-${Date.now()}`,
        req.user.id,
        name,
        type || null,
        fiber_content || null,
        weight || null,
        color || null,
        pattern || null,
        width || null,
        total_yards,
        cost_per_yard || null,
        total_cost || null,
        source || null,
        notes || null,
        is_pinned || false
      ]
    );

    res.status(201).json({
      message: 'Fabric created successfully',
      fabric: result.rows[0]
    });
  } catch (error) {
    console.error('Create fabric error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateFabric = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      fiber_content,
      weight,
      color,
      pattern,
      width,
      total_yards,
      cost_per_yard,
      total_cost,
      source,
      notes,
      is_pinned
    } = req.body;

    // Check if fabric exists and belongs to user
    const existingFabric = await pool.query(
      'SELECT id FROM fabrics WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingFabric.rows.length === 0) {
      return res.status(404).json({ message: 'Fabric not found' });
    }

    const result = await pool.query(
      `UPDATE fabrics SET 
        name = COALESCE($1, name),
        type = $2,
        fiber_content = $3,
        weight = $4,
        color = $5,
        pattern = $6,
        width = $7,
        total_yards = COALESCE($8, total_yards),
        cost_per_yard = $9,
        total_cost = $10,
        source = $11,
        notes = $12,
        is_pinned = COALESCE($13, is_pinned),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14 AND user_id = $15
      RETURNING *`,
      [
        name,
        type,
        fiber_content,
        weight,
        color,
        pattern,
        width,
        total_yards,
        cost_per_yard,
        total_cost,
        source,
        notes,
        is_pinned,
        id,
        req.user.id
      ]
    );

    res.json({
      message: 'Fabric updated successfully',
      fabric: result.rows[0]
    });
  } catch (error) {
    console.error('Update fabric error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFabric = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM fabrics WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fabric not found' });
    }

    res.json({ message: 'Fabric deleted successfully' });
  } catch (error) {
    console.error('Delete fabric error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const togglePin = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE fabrics 
       SET is_pinned = NOT is_pinned, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND user_id = $2 
       RETURNING id, is_pinned`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fabric not found' });
    }

    res.json({
      message: 'Fabric pin status updated',
      is_pinned: result.rows[0].is_pinned
    });
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const recordUsage = async (req, res) => {
  try {
    const { fabricId } = req.params;
    const { yards_used, project_name, notes, project_id } = req.body;

    if (!yards_used || !project_name) {
      return res.status(400).json({ message: 'Yards used and project name are required' });
    }

    // Check if fabric exists and belongs to user
    const fabric = await pool.query(
      'SELECT * FROM fabrics WHERE id = $1 AND user_id = $2',
      [fabricId, req.user.id]
    );

    if (fabric.rows.length === 0) {
      return res.status(404).json({ message: 'Fabric not found' });
    }

    const fabricData = fabric.rows[0];
    const newYardsLeft = Math.max(0, fabricData.total_yards - yards_used);

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Record usage
      await client.query(
        `INSERT INTO usage_history (
          id, fabric_id, user_id, project_id, yards_used, project_name, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          `usage-${Date.now()}`,
          fabricId,
          req.user.id,
          project_id || null,
          yards_used,
          project_name,
          notes || null
        ]
      );

      // Update fabric yards left
      await client.query(
        'UPDATE fabrics SET total_yards = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newYardsLeft, fabricId]
      );

      await client.query('COMMIT');

      res.json({
        message: 'Usage recorded successfully',
        yards_left: newYardsLeft
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Record usage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsageHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT uh.*, f.name as fabric_name 
       FROM usage_history uh 
       JOIN fabrics f ON uh.fabric_id = f.id 
       WHERE uh.user_id = $1 
       ORDER BY uh.usage_date DESC`,
      [req.user.id]
    );

    res.json({ usage_history: result.rows });
  } catch (error) {
    console.error('Get usage history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
