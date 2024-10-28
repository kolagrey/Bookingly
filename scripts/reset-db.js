const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function resetDatabase() {
  try {
    console.log('Starting database reset...')

    // Drop all tables (except migrations)
    const { error: dropError } = await supabase.rpc('reset_database')
    if (dropError) throw dropError

    // Run migrations
    require('./migrate')

    // Run seeds
    require('./seed')

    console.log('Database reset completed successfully')
  } catch (error) {
    console.error('Database reset failed:', error)
    process.exit(1)
  }
}

resetDatabase()