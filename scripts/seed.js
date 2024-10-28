const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function seed() {
  try {
    console.log('Starting database seeding...')

    // Seed expertise categories
    await supabase.from('expertise_categories').insert([
      { name: 'Web Development', description: 'Frontend and backend development' },
      { name: 'Mobile Development', description: 'iOS and Android development' },
      { name: 'DevOps', description: 'Infrastructure and deployment' },
      { name: 'Data Science', description: 'Analytics and machine learning' },
    ])

    // Seed review categories
    await supabase.from('review_categories').insert([
      { name: 'Knowledge', description: 'Expert\'s domain knowledge' },
      { name: 'Communication', description: 'Clarity and responsiveness' },
      { name: 'Professionalism', description: 'Professional conduct' },
      { name: 'Value', description: 'Value for money' },
    ])

    console.log('Database seeding completed successfully')
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seed()