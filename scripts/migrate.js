const { execSync } = require('child_process')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function migrate() {
  try {
    console.log('Starting database migration...')

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../src/lib/supabase/migrations')
    const migrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    // Get executed migrations
    const { data: executedMigrations } = await supabase
      .from('migrations')
      .select('name')

    const executedNames = new Set(executedMigrations?.map(m => m.name) || [])

    // Execute new migrations
    for (const migration of migrations) {
      if (!executedNames.has(migration)) {
        console.log(`Executing migration: ${migration}`)
        
        const sql = fs.readFileSync(
          path.join(migrationsDir, migration),
          'utf8'
        )

        // Execute migration
        const { error } = await supabase.rpc('run_migration', {
          migration_sql: sql,
          migration_name: migration,
        })

        if (error) throw error

        // Record migration
        await supabase
          .from('migrations')
          .insert({ name: migration })

        console.log(`Completed migration: ${migration}`)
      }
    }

    console.log('Database migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()